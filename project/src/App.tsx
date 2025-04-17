import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Users, Dumbbell, Music, MessageCircle, Calendar, GraduationCap, MapPin, ArrowRight } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ActivityDetails } from './pages/ActivityDetails';
import { MembersPage } from './pages/MembersPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';

function ActivityCard({ icon: Icon, title, description, category }: { 
  icon: React.ElementType, 
  title: string, 
  description: string,
  category: string 
}) {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => navigate(`/activities/${category}`)}
    >
      <Icon className="w-12 h-12 text-blue-600 mb-4" />
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-xl text-gray-600">{description}</p>
    </div>
  );
}

function PeopleCard({ name, age, location, interests, image }: {
  name: string;
  age: number;
  location: string;
  interests: string[];
  image: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h3 className="text-2xl font-bold">{name}</h3>
          <p className="text-xl text-gray-600">{age}세</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-blue-600" />
        <span className="text-lg text-gray-600">{location}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest, index) => (
          <span 
            key={index}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-lg"
          >
            {interest}
          </span>
        ))}
      </div>
      <button className="w-full mt-4 bg-blue-600 text-white text-xl px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        메시지 보내기
      </button>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  
  const activities = [
    {
      icon: Music,
      title: "콘서트 & 공연",
      description: "함께 음악을 즐기고 문화생활을 즐겨보세요",
      category: "concerts"
    },
    {
      icon: Dumbbell,
      title: "야외활동 & 운동",
      description: "등산, 걷기, 요가 등 다양한 운동을 함께해요",
      category: "outdoor-fitness"
    },
    {
      icon: GraduationCap,
      title: "배움교실",
      description: "스마트폰 활용, 취미 강좌 등 새로운 것을 배워보세요",
      category: "education"
    },
    {
      icon: Users,
      title: "친목 모임",
      description: "다양한 취미 활동을 함께 즐길 친구를 찾아보세요",
      category: "social"
    },
    {
      icon: MessageCircle,
      title: "소통하기",
      description: "다른 회원들과 자유롭게 대화를 나눠보세요",
      category: "chat"
    }
  ];

  const people = [
    {
      name: "김영희",
      age: 65,
      location: "서울시 종로구",
      interests: ["등산", "요가", "독서"],
      image: "https://images.unsplash.com/photo-1581087707353-2186241a3c50?q=80&w=2670&auto=format&fit=crop"
    },
    {
      name: "박철수",
      age: 70,
      location: "서울시 강남구",
      interests: ["골프", "음악감상", "여행"],
      image: "https://images.unsplash.com/photo-1559963629-38e8eba76e7d?q=80&w=2670&auto=format&fit=crop"
    },
    {
      name: "이미경",
      age: 68,
      location: "서울시 마포구",
      interests: ["댄스", "원예", "요리"],
      image: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?q=80&w=2671&auto=format&fit=crop"
    }
  ];

  return (
    <>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Today's Activities Section */}
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold">오늘의 활동</h2>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <p className="text-2xl text-center text-gray-600">
              2024년 3월 21일 목요일
            </p>
            <div className="mt-4 text-xl text-center text-blue-600">
              진행중인 활동이 없습니다
            </div>
          </div>
        </section>

        {/* Activities Grid */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">활동 둘러보기</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <ActivityCard key={index} {...activity} />
            ))}
          </div>
        </section>

        {/* People Browse Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">회원 둘러보기</h2>
            <button 
              onClick={() => navigate('/members')}
              className="flex items-center gap-2 text-xl text-blue-600 hover:text-blue-700 transition-colors"
            >
              더보기
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {people.map((person, index) => (
              <PeopleCard key={index} {...person} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/activities/:category" element={<ActivityDetails />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;