import { useState, useEffect, Fragment } from "react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  phone: string;
  gender: string;
}

interface GameStats {
  totalGames: number;
  hoursPlayed: number;
  achievements: number;
  level: number;
}

function ModernProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gameStats] = useState<GameStats>({
    totalGames: 42,
    hoursPlayed: 1337,
    achievements: 89,
    level: 25
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_USER_API_URL}/users/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
          } else {
            setError("Failed to load profile");
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getAvatarUrl = () => {
    return user.gender === "female" 
      ? "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
      : "https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp";
  };

  return (
    <Fragment>
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="hero bg-gradient-to-r from-primary to-secondary rounded-3xl text-primary-content mb-8">
            <div className="hero-content flex-col lg:flex-row py-12">
              <div className="avatar">
                <div className="w-32 h-32 rounded-full ring ring-primary-content ring-offset-base-100 ring-offset-2">
                  <img src={getAvatarUrl()} alt="Profile" />
                </div>
              </div>
              
              <div className="text-center lg:text-left lg:ml-8">
                <h1 className="text-5xl font-bold">{user.firstName} {user.lastName}</h1>
                <p className="py-4 text-lg opacity-90">
                  "I'm {user.firstName}, a passionate gamer who loves exploring new worlds and conquering challenges. Let's conquer the gaming world together!"
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <div className="badge badge-accent badge-lg">Level {gameStats.level}</div>
                  <div className="badge badge-secondary badge-lg">Pro Gamer</div>
                  <div className="badge badge-success badge-lg">Active Player</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stat bg-base-100 rounded-2xl shadow-xl">
              <div className="stat-figure text-primary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 016 0h1m-7 10a3 3 0 01-6 0v-3a3 3 0 013-3h3m3 3a3 3 0 016 0v3a3 3 0 01-3 3h-3"></path>
                </svg>
              </div>
              <div className="stat-title">Games Owned</div>
              <div className="stat-value text-primary">{gameStats.totalGames}</div>
              <div className="stat-desc">All platforms</div>
            </div>

            <div className="stat bg-base-100 rounded-2xl shadow-xl">
              <div className="stat-figure text-secondary">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="stat-title">Hours Played</div>
              <div className="stat-value text-secondary">{gameStats.hoursPlayed.toLocaleString()}</div>
              <div className="stat-desc">This year</div>
            </div>

            <div className="stat bg-base-100 rounded-2xl shadow-xl">
              <div className="stat-figure text-accent">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
              </div>
              <div className="stat-title">Achievements</div>
              <div className="stat-value text-accent">{gameStats.achievements}</div>
              <div className="stat-desc">Unlocked</div>
            </div>

            <div className="stat bg-base-100 rounded-2xl shadow-xl">
              <div className="stat-figure text-success">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="stat-title">Current Level</div>
              <div className="stat-value text-success">{gameStats.level}</div>
              <div className="stat-desc">Epic Gamer</div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Personal Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                    <span className="font-semibold">Full Name</span>
                    <span>{user.firstName} {user.lastName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                    <span className="font-semibold">Email</span>
                    <span className="text-primary">{user.email}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                    <span className="font-semibold">Age</span>
                    <span>{user.age} years old</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                    <span className="font-semibold">Phone</span>
                    <span>{user.phone}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                    <span className="font-semibold">Gender</span>
                    <span className="capitalize">{user.gender}</span>
                  </div>
                </div>

                <div className="card-actions justify-end mt-6">
                  <button className="btn btn-primary">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Gaming Preferences */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 016 0h1m-7 10a3 3 0 01-6 0v-3a3 3 0 013-3h3m3 3a3 3 0 016 0v3a3 3 0 01-3 3h-3"></path>
                  </svg>
                  Gaming Preferences
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Favorite Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      <div className="badge badge-primary">Action</div>
                      <div className="badge badge-secondary">RPG</div>
                      <div className="badge badge-accent">Strategy</div>
                      <div className="badge badge-success">Adventure</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      <div className="badge badge-outline">PC</div>
                      <div className="badge badge-outline">PlayStation</div>
                      <div className="badge badge-outline">Nintendo Switch</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Recent Activity</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                        <div className="w-3 h-3 bg-success rounded-full"></div>
                        <span>Completed "Epic Adventure" - 2 hours ago</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span>Unlocked achievement "Master Player" - 1 day ago</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                        <div className="w-3 h-3 bg-secondary rounded-full"></div>
                        <span>Purchased "Cyber Game 2077" - 3 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ModernProfile;
