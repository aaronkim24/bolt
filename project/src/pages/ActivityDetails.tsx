import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, MapPin, Calendar as CalendarIcon, Clock, SortDesc, ArrowLeft, Train, Bus, X } from 'lucide-react';

// Mock data for activities with transportation info
const mockActivities = {
  'concerts': [
    {
      id: 1,
      title: '클래식 음악 감상회',
      location: '시민문화회관 소공연장',
      date: '2024년 3월 28일',
      time: '오후 2:00',
      currentMembers: 15,
      maxMembers: 30,
      description: '베토벤의 교향곡을 함께 감상하고 이야기를 나누는 시간을 가집니다.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2670&auto=format&fit=crop',
      createdAt: '2024-03-15T09:00:00Z',
      transportation: {
        subway: '2호선 시청역 4번 출구에서 도보 5분',
        bus: '간선버스 401, 402번 시민회관앞 하차',
        additionalInfo: '건물 1층 안내데스크에서 공연장 위치 안내 가능'
      }
    },
    {
      id: 2,
      title: '실버 합창단 공연',
      location: '노인종합복지관 대강당',
      date: '2024년 3월 30일',
      time: '오후 3:00',
      currentMembers: 25,
      maxMembers: 50,
      description: '우리 동네 실버 합창단의 봄맞이 특별 공연에 여러분을 초대합니다.',
      image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=2670&auto=format&fit=crop',
      createdAt: '2024-03-10T09:00:00Z',
      transportation: {
        subway: '3호선 경복궁역 1번 출구에서 도보 10분',
        bus: '마을버스 종로07, 직행버스 1020번 복지관앞 하차',
        additionalInfo: '복지관 정문에서 자원봉사자의 안내를 받으실 수 있습니다'
      }
    }
  ],
  'outdoor-fitness': [
    {
      id: 1,
      title: '아침 공원 산책 모임',
      location: '중앙공원',
      date: '2024년 3월 25일',
      time: '오전 7:30',
      currentMembers: 8,
      maxMembers: 15,
      description: '매일 아침 공원에서 함께 걸으며 건강도 챙기고 이야기도 나누어요.',
      image: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?q=80&w=2670&auto=format&fit=crop',
      createdAt: '2024-03-18T09:00:00Z',
      transportation: {
        subway: '1호선 시청역 2번 출구에서 도보 3분',
        bus: '간선버스 103, 150번 중앙공원앞 하차',
        additionalInfo: '공원 정문 벤치에서 모임 진행'
      }
    },
    {
      id: 2,
      title: '초보자를 위한 요가 클래스',
      location: '실버복지관 2층',
      date: '2024년 3월 26일',
      time: '오전 10:00',
      currentMembers: 12,
      maxMembers: 20,
      description: '관절에 무리가 가지 않는 편안한 요가 동작들을 배워봅니다.',
      image: 'https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?q=80&w=2670&auto=format&fit=crop',
      createdAt: '2024-03-12T09:00:00Z',
      transportation: {
        subway: '4호선 혜화역 3번 출구에서 도보 7분',
        bus: '마을버스 종로13, 간선버스 601번 실버복지관 하차',
        additionalInfo: '엘리베이터 이용 가능, 2층 다목적실'
      }
    }
  ],
  'education': [
    {
      id: 1,
      title: '스마트폰 활용 기초반',
      location: '디지털배움터 1호점',
      date: '2024년 3월 27일',
      time: '오후 2:00',
      currentMembers: 10,
      maxMembers: 15,
      description: '카카오톡 사용법부터 사진 촬영, 편집까지 기초부터 차근차근 배워봅니다.',
      image: 'https://images.unsplash.com/photo-1522152302542-71a8e5172aa1?q=80&w=2670&auto=format&fit=crop',
      createdAt: '2024-03-14T09:00:00Z',
      transportation: {
        subway: '5호선 광화문역 2번 출구에서 도보 5분',
        bus: '간선버스 172, 472번 디지털센터앞 하차',
        additionalInfo: '건물 로비에서 안내데스크 직원에게 문의'
      }
    },
    {
      id: 2,
      title: '수채화 그리기 교실',
      location: '문화센터 미술실',
      date: '2024년 3월 29일',
      time: '오전 10:30',
      currentMembers: 8,
      maxMembers: 12,
      description: '봄꽃을 주제로 아름다운 수채화 그리기를 배워봅니다. 초보자도 환영합니다.',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2670&auto=format&fit=crop',
      createdAt: '2024-03-16T09:00:00Z',
      transportation: {
        subway: '6호선 안국역 4번 출구에서 도보 8분',
        bus: '마을버스 종로11, 간선버스 273번 문화센터앞 하차',
        additionalInfo: '주차 가능, 미술실은 3층'
      }
    }
  ],
  'social': [
    {
      id: 1,
      title: '오후의 티타임',
      location: '실버카페',
      date: '2024년 3월 26일',
      time: '오후 3:00',
      currentMembers: 6,
      maxMembers: 10,
      description: '따뜻한 차와 함께 편안한 대화를 나누는 소모임입니다.',
      image: 'https://images.unsplash.com/photo-1545062156-d29fd04c5321?q=80&w=2670&auto=format&fit=crop',
      createdAt: '2024-03-17T09:00:00Z',
      transportation: {
        subway: '3호선 안국역 1번 출구에서 도보 5분',
        bus: '마을버스 종로02, 간선버스 151번 실버카페앞 하차',
        additionalInfo: '카페 입구에 모임 안내판 설치'
      }
    },
    {
      id: 2,
      title: '추억의 영화 감상회',
      location: '노인복지관 시청각실',
      date: '2024년 3월 28일',
      time: '오후 1:00',
      currentMembers: 15,
      maxMembers: 25,
      description: '70-80년대 추억의 영화를 함께 보고 이야기 나누는 시간을 가집니다.',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2670&auto=format&fit=crop',
      createdAt: '2024-03-13T09:00:00Z',
      transportation: {
        subway: '2호선 을지로입구역 1번 출구에서 도보 7분',
        bus: '간선버스 402, 405번 복지관입구 하차',
        additionalInfo: '1층 안내데스크에서 방문증 수령 필요'
      }
    }
  ],
  'chat': [
    {
      id: 1,
      title: '우리 동네 이야기방',
      location: '온라인 채팅방',
      date: '상시 운영',
      time: '24시간',
      currentMembers: 45,
      maxMembers: 100,
      description: '우리 동네 소식과 일상을 나누는 온라인 대화방입니다.',
      image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2670&auto=format&fit=crop',
      createdAt: '2024-03-11T09:00:00Z',
      transportation: {
        additionalInfo: '온라인 모임입니다. 스마트폰이나 컴퓨터로 참여하실 수 있습니다.'
      }
    },
    {
      id: 2,
      title: '취미 공유 모임',
      location: '온라인 채팅방',
      date: '상시 운영',
      time: '24시간',
      currentMembers: 30,
      maxMembers: 50,
      description: '등산, 그림, 요리 등 다양한 취미를 공유하고 이야기하는 공간입니다.',
      image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop',
      createdAt: '2024-03-19T09:00:00Z',
      transportation: {
        additionalInfo: '온라인 모임입니다. 스마트폰이나 컴퓨터로 참여하실 수 있습니다.'
      }
    }
  ]
};

const categoryTitles = {
  'concerts': '콘서트 & 공연',
  'outdoor-fitness': '야외활동 & 운동 모임',
  'education': '배움교실',
  'social': '친목 모임',
  'chat': '소통하기'
};

type SortOption = '최신순' | '인기순' | '참여율순';

interface TransportationInfo {
  subway?: string;
  bus?: string;
  additionalInfo: string;
}

function LocationModal({ 
  isOpen, 
  onClose, 
  location, 
  transportation 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  location: string;
  transportation: TransportationInfo;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-8 h-8" />
        </button>

        <h2 className="text-3xl font-bold mb-6">{location} 오시는 길</h2>

        <div className="space-y-4 text-xl">
          {transportation.subway && (
            <div className="flex items-start gap-3">
              <Train className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <p>{transportation.subway}</p>
            </div>
          )}
          
          {transportation.bus && (
            <div className="flex items-start gap-3">
              <Bus className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <p>{transportation.bus}</p>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">{transportation.additionalInfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ActivityDetails() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>('최신순');
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    transportation: TransportationInfo;
  } | null>(null);
  
  const activities = useMemo(() => {
    const categoryActivities = mockActivities[category as keyof typeof mockActivities] || [];
    
    return [...categoryActivities].sort((a, b) => {
      switch (sortBy) {
        case '최신순':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case '인기순':
          return b.currentMembers - a.currentMembers;
        case '참여율순':
          return (b.currentMembers / b.maxMembers) - (a.currentMembers / a.maxMembers);
        default:
          return 0;
      }
    });
  }, [category, sortBy]);

  const title = categoryTitles[category as keyof typeof categoryTitles] || '';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-2xl text-blue-600 hover:text-blue-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-8 h-8" />
        <span>메인으로 돌아가기</span>
      </button>

      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-8">
        {/* Activity Creation Button */}
        <button className="bg-blue-600 text-white text-2xl px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors">
          새로운 모임 만들기
        </button>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-md">
          <SortDesc className="w-6 h-6 text-blue-600" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xl bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="최신순">최신순</option>
            <option value="인기순">인기순</option>
            <option value="참여율순">참여율순</option>
          </select>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Activity Image */}
              <div className="md:w-1/3">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              {/* Activity Details */}
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold mb-4">{activity.title}</h2>
                
                <div className="space-y-3 text-xl">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <span>{activity.location}</span>
                    {activity.transportation && activity.location !== '온라인 채팅방' && (
                      <button
                        onClick={() => setSelectedLocation({
                          name: activity.location,
                          transportation: activity.transportation
                        })}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        위치 안내
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-6 h-6 text-blue-600" />
                    <span>{activity.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-blue-600" />
                    <span>{activity.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    <span>{activity.currentMembers}/{activity.maxMembers}명 참여중</span>
                  </div>
                </div>

                <p className="text-xl text-gray-600 mt-4">
                  {activity.description}
                </p>

                <button className="mt-6 bg-blue-600 text-white text-xl px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  참여하기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Location Modal */}
      {selectedLocation && (
        <LocationModal
          isOpen={true}
          onClose={() => setSelectedLocation(null)}
          location={selectedLocation.name}
          transportation={selectedLocation.transportation}
        />
      )}
    </div>
  );
}