import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { auth, configured, db } from './firebase'

const CloudContext = createContext(null)
const keys = ['replog_workouts_v1','replog_weights_v1','replog_body_v1','replog_completed_v1']
const initial = {replog_workouts_v1:{},replog_weights_v1:{},replog_body_v1:[],replog_completed_v1:{}}

function Credentials({onLogin}) {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [create,setCreate]=useState(false)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  async function submit(event){event.preventDefault();setBusy(true);setError('');try{await onLogin(email,password,create)}catch(e){setError(e.code==='auth/email-already-in-use'?'Account already exists. Sign in instead.':e.code==='auth/invalid-credential'?'Incorrect email or password.':e.code==='auth/weak-password'?'Use a stronger password (at least 6 characters).':e.message)}finally{setBusy(false)}}
  async function reset(){if(!email.trim()){setError('Enter your email address first.');return}setBusy(true);setError('');try{await sendPasswordResetEmail(auth,email.trim());setError('Password reset email sent. Check your inbox.')}catch(e){setError(e.message)}finally{setBusy(false)}}
  return <div className="auth-page"><div className="auth-card"><div className="auth-logo">🏋️ <span>RepLog</span></div><div className="auth-pill">YOUR FITNESS. YOUR DATA.</div><h1>{create?'Start your gym journey':'Welcome back'}</h1><p>Securely save your workouts and lifting progress with Firebase. Sign in on your phone or Mac to access the same records.</p><form onSubmit={submit}><label>Email address</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/><label>Password</label><input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete={create?'new-password':'current-password'}/><button className="auth-submit" disabled={busy}>{busy?'Please wait…':create?'Create account':'Sign in →'}</button></form>{error&&<div className="auth-message" role="status">{error}</div>}<div className="auth-links"><button onClick={()=>{setCreate(!create);setError('')}}>{create?'Already have an account? Sign in':'No account? Create one'}</button>{!create&&<button onClick={reset} disabled={busy}>Forgot password?</button>}</div></div></div>
}
export function CloudProvider({children}){
  const [user,setUser]=useState(null)
  const [authReady,setAuthReady]=useState(false)
  const [data,setData]=useState(initial)
  const [loaded,setLoaded]=useState(false)
  const [error,setError]=useState('')
  const dataRef=useRef(initial)
  const userRef=useRef(null)
  useEffect(()=>{if(!configured)return;return onAuthStateChanged(auth,person=>{setUser(person);userRef.current=person;setAuthReady(true)},e=>{setError(e.message);setAuthReady(true)})},[])
  useEffect(()=>{
    if(!user){setLoaded(false);dataRef.current=initial;setData(initial);return}
    let cancelled=false;const seen=new Set();setLoaded(false);setError('');dataRef.current=initial;setData(initial)
    const unsub=keys.map(key=>onSnapshot(doc(db,'users',user.uid,'tracker',key),snap=>{
      if(cancelled)return
      const raw=snap.exists()?snap.data().value:undefined
      const value=typeof raw==='string'?JSON.parse(raw):initial[key]
      dataRef.current={...dataRef.current,[key]:value}
      setData(dataRef.current)
      seen.add(key)
      if(seen.size===keys.length)setLoaded(true)
    },err=>{if(!cancelled){setError(`Firestore: ${err.message}`);setLoaded(true)}}))
    return ()=>{cancelled=true;unsub.forEach(fn=>fn())}
  },[user?.uid])
  const update=useCallback((key,change)=>{
    const current=dataRef.current[key]
    const next=typeof change==='function'?change(current):change
    dataRef.current={...dataRef.current,[key]:next}
    setData(dataRef.current)
    const person=userRef.current
    if(person)setDoc(doc(db,'users',person.uid,'tracker',key),{value:JSON.stringify(next),updatedAt:new Date().toISOString()}).catch(e=>setError(`Could not sync: ${e.message}`))
  },[])
  const login=async(email,password,create)=>create?createUserWithEmailAndPassword(auth,email.trim(),password):signInWithEmailAndPassword(auth,email.trim(),password)
  if(!configured)return <div className="auth-page"><div className="auth-card"><div className="auth-logo">🏋️ <span>RepLog</span></div><h1>Connect Firebase to get started</h1><p>This app saves workouts to Cloud Firestore. Add your Firebase project settings in <code>.env.local</code> and restart the Vite server.</p><p>Follow the included <strong>README.md</strong> for Firebase Auth, Firestore, security rules, and Vercel setup.</p></div></div>
  if(!authReady)return <div className="cloud-loading">Connecting to RepLog…</div>
  if(!user)return <Credentials onLogin={login}/>
  if(!loaded)return <div className="cloud-loading"><span>🏋️ RepLog</span><p>Loading your cloud workout history…</p>{error&&<p className="cloud-error">{error} — check your Firestore security rules.</p>}</div>
  return <CloudContext.Provider value={{data,update,user,error,signOut:()=>signOut(auth)}}>{children}</CloudContext.Provider>
}
export function useCloudStored(key){const ctx=useContext(CloudContext);if(!ctx)throw Error('Cloud provider missing');return [ctx.data[key],v=>ctx.update(key,v)]}
export function useCloud(){return useContext(CloudContext)}
