import { Link } from 'react-router-dom';
import { LightBulbIcon, WrenchScrewdriverIcon, HomeIcon, CpuChipIcon, PaintBrushIcon, WrenchIcon, BugAntIcon, SunIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { serviceCategories } from '../assets/assets';
const icons = [LightBulbIcon, WrenchScrewdriverIcon, HomeIcon, CpuChipIcon, PaintBrushIcon, WrenchIcon, BugAntIcon, CpuChipIcon, SunIcon, EllipsisHorizontalIcon];
export default function Categories() {
  return <section id="explore-categories" className="qf-report-categories">
    <h2>Explore by Category</h2>
    <p>Find trusted professionals for every type of service — from cleaning to electrical repairs.</p>
    <div className="qf-category-grid">{serviceCategories.map((category, index) => {
      const Icon = icons[index];
      return <Link key={category} className="qf-category-card" to={'/services?category=' + encodeURIComponent(category)}>
        <Icon aria-hidden="true" className="w-7 h-7 text-sky-600" />
        <span>{category}</span>
      </Link>;
    })}</div>
  </section>;
}
