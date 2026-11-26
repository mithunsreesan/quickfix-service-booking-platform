import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
export default function Hero() {
  const navigate = useNavigate();
  return <section className="qf-report-hero">
    <img src={assets.service_image3} alt="Air conditioning service professionals" className="qf-report-hero-image" />
    <div className="qf-report-hero-content">
      <h1>Your Life, Simplified</h1>
      <h2>All Services, One Click.</h2>
      <p>Book trusted professionals for home services, repairs, and<br className="hidden sm:block" /> more — anytime, anywhere.</p>
      <div className="flex justify-center flex-wrap gap-4 mt-7">
        <button onClick={() => navigate('/services')} className="qf-button rounded-full! px-8!">Let’s Go</button>
        <a href="#explore-categories" className="border border-white rounded-full px-7 py-3 hover:bg-white/10">Learn More</a>
      </div>
    </div>
  </section>;
}
