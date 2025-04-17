import React from 'react';
import { MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock user location (would come from real geolocation in production)
const userLocation = {
  latitude: 37.5665,
  longitude: 126.9780, // Seoul coordinates
};

const members = [
  {
    id: 1,
    name: "김영희",
    age: 65,
    location: "서울시 종로구",
    interests: ["등산", "요가", "독서"],
    image: "https://images.unsplash.com/photo-1581087707353-2186241a3c50?q=80&w=2670&auto=format&fit=crop",
    coordinates: {
      latitude: 37.5720,
      longitude: 126.9793,
    },
    bio: "매일 아침 요가로 하루를 시작하는 것을 좋아합니다. 등산과 독서를 통해 건강한 삶을 살고자 노력하고 있어요.",
    activities: ["아침 요가 모임", "북악산 등산 모임", "독서 토론회"],
  },
  {
    id: 2,
    name: "박철수",
    age: 70,
    location: "서울시 강남구",
    interests: ["골프", "음악감상", "여행"],
    image: "https://images.unsplash.com/photo-1559963629-38e8eba76e7d?q=80&w=2670&auto=format&fit=crop",
    coordinates: {
      latitude: 37.5172,
      longitude: 127.0473,
    },
    bio: "은퇴 후 골프를 시작했어요. 클래식 음악을 좋아하고, 국내 여행을 다니며 새로운 경험을 쌓고 있습니다.",
    activities: ["주말 골프 모임", "클래식 음악회", "국내여행 동호회"],
  },
  {
    id: 3,
    name: "이미경",
    age: 68,
    location: "서울시 마포구",
    interests: ["댄스", "원예", "요리"],
    image: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?q=80&w=2671&auto=format&fit=crop",
    coordinates: {
      latitude: 37.5567,
      longitude: 126.9365,
    },
    bio: "라인댄스를 3년째 배우고 있어요. 집에서 화초를 키우는 것을 좋아하고, 건강한 요리법을 공유하고 싶어요.",
    activities: ["라인댄스 수업", "도시농부 모임", "건강요리 교실"],
  },
  {
    id: 4,
    name: "정대호",
    age: 72,
    location: "서울시 서대문구",
    interests: ["바둑", "산책", "사진"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670&auto=format&fit=crop",
    coordinates: {
      latitude: 37.5791,
      longitude: 126.9368,
    },
    bio: "50년 동안 바둑을 두고 있습니다. 최근에는 디지털 카메라로 풍경 사진 찍는 것을 배우고 있어요.",
    activities: ["바둑 동호회", "사진 촬영 모임", "아침 산책"],
  },
  {
    id: 5,
    name: "한순자",
    age: 67,
    location: "서울시 용산구",
    interests: ["수영", "명상", "그림"],
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=2670&auto=format&fit=crop",
    coordinates: {
      latitude: 37.5320,
      longitude: 126.9900,
    },
    bio: "매일 아침 수영으로 건강을 유지하고 있어요. 주말에는 그림 그리기와 명상으로 마음의 평화를 찾고 있습니다.",
    activities: ["실버 수영 클럽", "수채화 교실", "마음챙김 명상"],
  }
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // 지구의 반경 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${Math.round(distance)}km`;
}

function MemberCard({ member }: { member: typeof members[0] }) {
  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    member.coordinates.latitude,
    member.coordinates.longitude
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex gap-6">
        <img 
          src={member.image} 
          alt={member.name}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold">{member.name}</h3>
            <span className="text-lg text-blue-600">{member.age}세</span>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="text-lg text-gray-600">{member.location}</span>
            <span className="text-lg text-blue-600">• {distance}</span>
          </div>

          <p className="text-lg text-gray-600 mb-4">{member.bio}</p>

          <div className="mb-4">
            <h4 className="text-xl font-semibold mb-2">참여중인 활동</h4>
            <div className="flex flex-wrap gap-2">
              {member.activities.map((activity, index) => (
                <span 
                  key={index}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-lg"
                >
                  {activity}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2">관심사</h4>
            <div className="flex flex-wrap gap-2">
              {member.interests.map((interest, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-lg"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <button className="w-full mt-6 bg-blue-600 text-white text-xl px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            메시지 보내기
          </button>
        </div>
      </div>
    </div>
  );
}

export function MembersPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-2xl text-blue-600 hover:text-blue-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-8 h-8" />
        <span>메인으로 돌아가기</span>
      </button>

      <h1 className="text-4xl font-bold mb-8">회원 둘러보기</h1>

      <div className="space-y-6">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}