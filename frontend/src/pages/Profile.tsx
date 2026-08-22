const Profile = () => {
  const user = {
    name: 'Jax',
    bio: 'Quantum Being in Training',
    interests: ['Space', 'Quantum Physics', 'books', 'Gaming'],
    avatar: '👑',
    level: 66,
    joinDate: '2026-08-22',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-dark via-cosmic-purple to-[#16213e]">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-quantum-purple to-quantum-pink flex items-center justify-center text-6xl mb-4 shadow-lg shadow-quantum-purple/20">
            {user.avatar}
          </div>
          <h1 className="text-3xl font-bold text-gradient">{user.name}</h1>
          <p className="text-quantum-purple/70 mt-1">{user.bio}</p>
          <div className="mt-3 inline-block px-4 py-1 bg-white/5 rounded-full border border-white/10 text-sm text-white/60">
            🌟 Level {user.level}
          </div>
        </div>

        <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white/80 mb-3">✨ Interests</h2>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, index) => (
              <span
                key={index}
                className="px-4 py-1.5 bg-quantum-purple/10 border border-quantum-purple/20 rounded-full text-sm text-quantum-purple/80"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
            <p className="text-2xl">📅</p>
            <p className="text-sm text-white/50">Joined</p>
            <p className="text-sm text-white/80">{user.joinDate}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
            <p className="text-2xl">🌌</p>
            <p className="text-sm text-white/50">Superpositions</p>
            <p className="text-sm text-white/80">42</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Profile;