import React, { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, db, firebaseEnabled } from './lib/firebase';

type ModerationStatus = 'pending' | 'approved' | 'rejected';

type ModerationItem = {
  id: string;
  name: string;
  idea?: string;
  text?: string;
  status: ModerationStatus;
  createdAt?: { toMillis?: () => number };
};

export const AdminModeration: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [solutions, setSolutions] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setIsAdmin(false);
        return;
      }

      const token = await nextUser.getIdTokenResult(true);
      setIsAdmin(token.claims.admin === true);
    });
  }, []);

  const loadModerationQueue = async () => {
    if (!db || !isAdmin) return;
    setLoading(true);
    try {
      const snapshot = await getDocs(query(collection(db, 'solutions'), orderBy('createdAt', 'desc')));
      setSolutions(
        snapshot.docs.map((item) => {
          const data = item.data() as ModerationItem;
          return { ...data, id: item.id };
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) void loadModerationQueue();
  }, [isAdmin]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auth) return;
    setLoginError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword('');
    } catch {
      setLoginError('Admin sign-in failed. Check the credentials and Firebase setup.');
    }
  };

  const moderate = async (id: string, status: ModerationStatus) => {
    if (!db || !isAdmin) return;
    await updateDoc(doc(db, 'solutions', id), { status, moderatedAt: new Date() });
    await loadModerationQueue();
  };

  const remove = async (id: string) => {
    if (!db || !isAdmin) return;
    await deleteDoc(doc(db, 'solutions', id));
    await loadModerationQueue();
  };

  if (!firebaseEnabled) {
    return <p className="p-8 text-sm text-[#aaa3a1]">Firebase is not configured.</p>;
  }

  if (!user || !isAdmin) {
    return (
      <main className="min-h-screen bg-[#08090c] p-6 text-[#eee9e1]">
        <form onSubmit={login} className="mx-auto mt-20 max-w-md rounded-3xl border border-white/10 bg-[#111319] p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d57a4b]">PRIVATE / ADMIN</p>
          <h1 className="mt-3 font-serif text-3xl">MENDER moderation</h1>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Admin email"
            className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none"
          />
          <button className="mt-4 w-full rounded-full bg-[#eee9e1] px-5 py-3 text-sm font-medium text-[#101115]">
            Sign in
          </button>
          {loginError ? <p className="mt-3 text-xs text-red-300">{loginError}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090c] p-6 text-[#eee9e1]">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d57a4b]">PRIVATE / ADMIN</p>
            <h1 className="mt-2 font-serif text-4xl">MENDER moderation</h1>
          </div>
          <button onClick={() => void signOut(auth!)} className="rounded-full border border-white/10 px-4 py-2 text-xs">
            Sign out
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {loading ? <p className="text-sm text-[#777272]">Loading…</p> : null}
          {solutions.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/10 bg-[#111319] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#d57a4b]">{item.status}</span>
                <span className="text-xs text-[#777272]">{item.name}</span>
              </div>
              <p className="mt-3 text-sm leading-6">{item.idea}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => void moderate(item.id, 'approved')} className="rounded-full border border-emerald-300/20 px-3 py-1.5 text-xs text-emerald-200">Approve</button>
                <button onClick={() => void moderate(item.id, 'rejected')} className="rounded-full border border-amber-300/20 px-3 py-1.5 text-xs text-amber-200">Reject</button>
                <button onClick={() => void remove(item.id)} className="rounded-full border border-red-300/20 px-3 py-1.5 text-xs text-red-200">Remove</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdminModeration;
