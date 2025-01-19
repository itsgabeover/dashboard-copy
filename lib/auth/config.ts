// lib/auth/config.ts

// Define types for better type safety
interface BetaUser {
  email: string;
  password: string;
}

// Beta test users with credentials
export const BETA_USERS: BetaUser[] = [
  { email: 'bobchwalk@outlook.com', password: 'test123' },
  { email: 'gabe.enrique.miranda@gmail.com', password: 'gabe123' },
  { email: 'bobchwalk@gmail.com', password: 'bob123' },
  { email: 'tester1@company.com', password: 'test456' },
  { email: 'demo1@insurance.com', password: 'demo789' },
  { email: 'pilot1@review.com', password: 'pilot321' },
  { email: 'trial1@planner.com', password: 'trial567' },
  { email: 'eval1@check.com', password: 'eval890' },
  { email: 'preview1@test.com', password: 'preview432' },
  { email: 'access1@beta.com', password: 'access765' }
];

// Verify user credentials
export const verifyCredentials = (email: string, password: string): boolean => {
  const user = BETA_USERS.find(user => user.email === email);
  if (!user) return false;
  return user.password === password;
};

// Generate a session token
export const generateToken = (email: string): string => {
  return Buffer.from(`${email}-${Date.now()}`).toString('base64');
};

// Verify token format and expiration
export const verifyToken = (token: string): boolean => {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [email, timestamp] = decoded.split('-');
    
    // Check if the token has valid format
    if (!email || !timestamp) return false;
    
    // Check if token is expired (24 hours)
    const tokenDate = parseInt(timestamp);
    const now = Date.now();
    const tokenAge = now - tokenDate;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (tokenAge > maxAge) return false;
    
    // Check if email exists in beta users
    return BETA_USERS.some(user => user.email === email);
  } catch {
    return false;
  }
};

// Get user email from token
export const getUserFromToken = (token: string): string | null => {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [email] = decoded.split('-');
    return email;
  } catch {
    return null;
  }
};
