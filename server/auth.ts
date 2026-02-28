import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

export async function withAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!supabase) {
    return res.status(500).json({ message: "Supabase not configured on server" });
  }

  const authHeader = req.headers.authorization;
  const cookieHeader = req.headers.cookie;

  let token: string | undefined;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (cookieHeader) {
    // Basic cookie parsing for sb-access-token or similar if needed
    // In many setups, the client sends the token in the Authorization header
    const cookies = Object.fromEntries(cookieHeader.split(';').map(c => c.trim().split('=')));
    token = cookies['sb-access-token'];
  }

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || 'user'
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
}

export function withRole(role: 'user' | 'driver' | 'admin') {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
}
