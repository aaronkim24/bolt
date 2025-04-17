import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const interests = [
  "등산", "요가", "독서", "골프", "음악감상", "여행", 
  "댄스", "원예", "요리", "바둑", "산책", "사진",
  "수영", "명상", "그림", "노래", "악기연주", "공예"
];

const activities = [
  "아침 요가 모임", "등산 모임", "독서 토론회",
  "골프 동호회", "클래식 음악회", "국내여행 동호회",
  "라인댄스 수업", "도시농부 모임", "건강요리 교실",
  "바둑 동호회", "사진 촬영 모임", "아침 산책",
  "실버 수영 클럽", "마음챙김 명상", "수채화 교실"
];

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    profileImage: user?.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop',
    interests: user?.interests || [],
    activities: user?.activities || []
  });

  if (!user) {
    navigate('/');
    return null;
  }

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleActivity = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-2xl text-blue-600 hover:text-blue-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-8 h-8" />
        <span>메인으로 돌아가기</span>
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          {/* Profile Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">내 프로필</h1>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? (
                <>
                  <Save className="w-6 h-6" />
                  <span>저장하기</span>
                </>
              ) : (
                <span>수정하기</span>
              )}
            </button>
          </div>

          {/* Profile Image */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            <img
              src={formData.profileImage}
              alt={formData.name}
              className="w-full h-full rounded-full object-cover"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-xl font-medium text-gray-700 mb-2">
                이름
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 text-xl text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-2xl">{formData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xl font-medium text-gray-700 mb-2">
                자기소개
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-3 text-xl text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              ) : (
                <p className="text-xl text-gray-600">{formData.bio || '자기소개를 입력해주세요.'}</p>
              )}
            </div>

            <div>
              <label className="block text-xl font-medium text-gray-700 mb-2">
                <MapPin className="inline-block w-6 h-6 mr-2" />
                위치
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 text-xl text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="예: 서울시 종로구"
                />
              ) : (
                <p className="text-xl text-gray-600">{formData.location || '위치를 입력해주세요.'}</p>
              )}
            </div>
          </div>

          {/* Interests */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">관심사</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {interests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => isEditing && toggleInterest(interest)}
                  disabled={!isEditing}
                  className={`p-3 text-lg rounded-lg border-2 transition-colors ${
                    formData.interests.includes(interest)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-gray-700 border-gray-300 hover:border-blue-400'
                  } ${!isEditing && 'cursor-default'}`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div>
            <h2 className="text-2xl font-bold mb-4">참여중인 활동</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activities.map((activity) => (
                <button
                  key={activity}
                  onClick={() => isEditing && toggleActivity(activity)}
                  disabled={!isEditing}
                  className={`p-4 text-lg rounded-lg border-2 transition-colors ${
                    formData.activities.includes(activity)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-gray-700 border-gray-300 hover:border-blue-400'
                  } ${!isEditing && 'cursor-default'}`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}