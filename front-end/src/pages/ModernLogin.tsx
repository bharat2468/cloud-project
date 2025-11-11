import { Fragment, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function ModernLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_USER_API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
      });
  
      if (response.ok) {
        console.log("Login successful");
        const data = await response.json();
        
        // Use the AuthContext login function
        login(data.token);
        
        // Show success message
        const successAlert = document.getElementById('success-alert');
        if (successAlert) {
          successAlert.classList.remove('hidden');
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
        } else {
          window.location.href = "/";
        }
      } else {
        const errorAlert = document.getElementById('error-alert');
        if (errorAlert) {
          errorAlert.classList.remove('hidden');
          setTimeout(() => {
            errorAlert.classList.add('hidden');
          }, 3000);
        }
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorAlert = document.getElementById('error-alert');
      if (errorAlert) {
        errorAlert.classList.remove('hidden');
        setTimeout(() => {
          errorAlert.classList.add('hidden');
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Fragment>
      <div className="hero min-h-screen bg-gradient-to-br from-primary to-secondary">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-white">Welcome Back!</h1>
            <p className="py-6 text-white/80">
              Sign in to access your gaming collection and discover new adventures.
              Your next favorite game is waiting for you!
            </p>
          </div>
          
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Login</h2>
                <p className="text-base-content/70">Enter your credentials to continue</p>
              </div>

              {/* Error Alert */}
              <div id="error-alert" className="alert alert-error hidden mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Invalid email or password!</span>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="input input-bordered w-full pr-12"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm absolute right-1 top-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                </label>
              </div>

              <div className="form-control mt-6">
                <button 
                  className={`btn btn-primary ${loading ? 'loading' : ''}`} 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>
              </div>

              <div className="divider">OR</div>

              <div className="text-center">
                <span className="text-sm">Don't have an account? </span>
                <a href="/register" className="link link-primary font-semibold">
                  Sign up now
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ModernLogin;
