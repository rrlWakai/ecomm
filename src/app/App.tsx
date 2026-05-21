import { Navbar } from './components/Navbar';
import { ProductSceneLaptop } from './components/ProductSceneLaptop';
import { EditorialScene } from './components/EditorialScene';
import { SplitScenePhone } from './components/SplitScenePhone';
import { ProductSceneTablet } from './components/ProductSceneTablet';
import { LifestyleSceneDesktop } from './components/LifestyleSceneDesktop';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ProductSceneLaptop />
      <EditorialScene />
      <SplitScenePhone />
      <ProductSceneTablet />
      <LifestyleSceneDesktop />
      <Footer />
    </div>
  );
}