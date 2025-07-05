import React, { useState, useRef } from 'react';
import { Volume2, User, Save, Settings } from 'lucide-react';

const soundOptions = [
  { label: 'Default Ding', value: '/sounds/ding.mp3' },
  { label: 'Pop', value: '/sounds/pop.mp3' },
  { label: 'Chime', value: '/sounds/chime.mp3' },
  { label: 'Buzz', value: '/sounds/buzz.mp3' },
];

const AdminSettings = () => {
  const [adminName, setAdminName] = useState('Admin');
  const [selectedSound, setSelectedSound] = useState(soundOptions[0].value);
  const audioRef = useRef(null);

  const handleSoundChange = (e) => {
    setSelectedSound(e.target.value);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const sound = new Audio(e.target.value);
    sound.play();
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
    // Save logic goes here (API or localStorage)
  };

  return (
    <div className=" mx-auto p-10 bg-white  border h-screen border-gray-200">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
        <Settings className="mr-2" /> Admin Settings
      </h1>

      <div className="mb-5">
        <label className="block text-gray-700 font-medium mb-2 flex items-center">
          <User className="mr-1" /> Admin Name
        </label>
        <input
          type="text"
          value={adminName}
          onChange={(e) => setAdminName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 font-medium mb-2 flex items-center">
          <Volume2 className="mr-1" /> Notification Sound
        </label>
        <select
          value={selectedSound}
          onChange={handleSoundChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {soundOptions.map((sound, idx) => (
            <option key={idx} value={sound.value}>{sound.label}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2"
      >
        <Save size={16} /> Save Settings
      </button>

      {/* For preview/testing */}
      <audio ref={audioRef} src={selectedSound} />
    </div>
  );
};

export default AdminSettings;