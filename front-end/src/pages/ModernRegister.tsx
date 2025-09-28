import { useState } from "react";

function ModernRegister() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    if (password !== confPassword) {
      const errorAlert = document.getElementById('error-alert');
      if (errorAlert) {
        errorAlert.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Passwords don't match!</span>
        `;
        errorAlert.classList.remove('hidden');
        setTimeout(() => {
          errorAlert.classList.add('hidden');
        }, 3000);
      }
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_USER_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, firstName, lastName, age, phone, gender })
      });
  
      if (response.ok) {
        console.log("Registration successful");
        const successAlert = document.getElementById('success-alert');
        if (successAlert) {
          successAlert.classList.remove('hidden');
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      } else {
        console.log("Registration failed");
        const errorAlert = document.getElementById('error-alert');
        if (errorAlert) {
          errorAlert.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Registration failed. Please try again.</span>
          `;
          errorAlert.classList.remove('hidden');
          setTimeout(() => {
            errorAlert.classList.add('hidden');
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="hero min-h-screen bg-gradient-to-br from-secondary to-accent">
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center lg:text-left lg:mr-8">
          <h1 className="text-5xl font-bold text-white">Join Our Gaming Community!</h1>
          <p className="py-6 text-white/80">
            Create your account to access thousands of games, connect with fellow gamers,
            and build your ultimate gaming collection. Adventure awaits!
          </p>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                </svg>
              </div>
              <div className="stat-title">Games Available</div>
              <div className="stat-value text-primary">1000+</div>
            </div>
          </div>
        </div>
        
        <div className="card shrink-0 w-full max-w-2xl shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold">Create Account</h2>
              <p className="text-base-content/70">Fill in your information to get started</p>
            </div>

            {/* Success Alert */}
            <div id="success-alert" className="alert alert-success hidden mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Registration successful! Redirecting to login...</span>
            </div>

            {/* Error Alert */}
            <div id="error-alert" className="alert alert-error hidden mb-4">
              {/* Content will be inserted dynamically */}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="input input-bordered"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="input input-bordered"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input input-bordered"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="input input-bordered"
                  required
                  value={phone}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Age</span>
                </label>
                <input
                  type="number"
                  placeholder="Age"
                  className="input input-bordered"
                  min="13"
                  max="120"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <select 
                  className="select select-bordered"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="input input-bordered w-full pr-12"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm absolute right-1 top-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="input input-bordered w-full pr-12"
                    required
                    minLength={6}
                    value={confPassword}
                    onChange={(e) => setConfPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm absolute right-1 top-1"
                    onClick={() => setShowConfPassword(!showConfPassword)}
                  >
                    {showConfPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-control mt-6">
              <button 
                className={`btn btn-primary btn-lg ${loading ? 'loading' : ''}`} 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            <div className="divider">OR</div>

            <div className="text-center">
              <span className="text-sm">Already have an account? </span>
              <a href="/login" className="link link-primary font-semibold">
                Sign in here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModernRegister;
