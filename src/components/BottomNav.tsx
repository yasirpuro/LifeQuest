import { Home, Compass, Users, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BottomNav.module.css';

const tabs = [
  { path: '/dashboard', icon: Home, label: 'Ana Sayfa' },
  { path: '/quests', icon: Compass, label: 'Gorevler' },
  { path: '/social', icon: Users, label: 'Sosyal' },
  { path: '/profile', icon: User, label: 'Profil' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      {tabs.map(tab => {
        const active = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            className={`${styles.tab} ${active ? styles.active : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <Icon size={22} />
            <span className={styles.label}>{tab.label}</span>
            {active && <div className={styles.indicator} />}
          </button>
        );
      })}
    </nav>
  );
}
