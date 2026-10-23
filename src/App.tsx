import { lazy, Suspense, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollToTop } from "./components/ScrollToTop";
import { TrackingScripts } from "./components/tracking/TrackingScripts";
import CookieConsent from "./components/CookieConsent";
import { loadGA4, trackPageView } from "./lib/analytics";
import { Loader2 } from "lucide-react";

// Critical path — loaded eagerly (homepage)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-loaded public pages
const About = lazy(() => import("./pages/About"));
const ResidentialServices = lazy(() => import("./pages/services/ResidentialServices"));
const CommercialServices = lazy(() => import("./pages/services/CommercialServices"));
const DuctlessServices = lazy(() => import("./pages/services/DuctlessServices"));
const AirSealingDallas = lazy(() => import("./pages/services/AirSealingDallas"));
const HvacEstimate = lazy(() => import("./pages/HvacEstimate"));
const HeatPumpAdvantage = lazy(() => import("./pages/HeatPumpAdvantage"));
const SizingCalculator = lazy(() => import("./pages/estimators/SizingCalculator"));
const CostEstimator = lazy(() => import("./pages/estimators/CostEstimator"));
const SavingsCalculator = lazy(() => import("./pages/estimators/SavingsCalculator"));
const SmartGroupEntry = lazy(() => import("./pages/estimators/SmartGroupEntry"));
const CentralAcEstimate = lazy(() => import("./pages/estimates/CentralAcEstimate"));
const MiniSplitEstimate = lazy(() => import("./pages/estimates/MiniSplitEstimate"));
const MultiZoneEstimate = lazy(() => import("./pages/estimates/MultiZoneEstimate"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePreferences = lazy(() => import("./pages/CookiePreferences"));
const DallasArea = lazy(() => import("./pages/service-areas/DallasArea"));
const NorthDallasArea = lazy(() => import("./pages/service-areas/NorthDallasArea"));
const FriscoMcKinneyArea = lazy(() => import("./pages/service-areas/FriscoMcKinneyArea"));
const MidCitiesArea = lazy(() => import("./pages/service-areas/MidCitiesArea"));
const SouthDallasArea = lazy(() => import("./pages/service-areas/SouthDallasArea"));
const ServiceAreasHub = lazy(() => import("./pages/service-areas/ServiceAreasHub"));
const ClusterSubHub = lazy(() => import("./pages/service-areas/ClusterSubHub"));
const LocationPage = lazy(() => import("./pages/service-areas/LocationPage"));
const Careers = lazy(() => import("./pages/Careers"));
const Financing = lazy(() => import("./pages/Financing"));
const FreeHvacAgeCheckerFB = lazy(() => import("./pages/landing/FreeHvacAgeCheckerFB"));
const CampaignLandingPage = lazy(() => import("./pages/landing/CampaignLandingPage"));
const SmartGroupMarchLanding = lazy(() => import("./pages/landing/SmartGroupMarchLanding"));
const SmartGroupMarchV2Landing = lazy(() => import("./pages/landing/SmartGroupMarchV2Landing"));
const SmartGroupMarchGoogleLanding = lazy(() => import("./pages/landing/SmartGroupMarchGoogleLanding"));
const PublicEstimatePreview = lazy(() => import("./pages/PublicEstimatePreview"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogCategory = lazy(() => import("./pages/BlogCategory"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Scanner = lazy(() => import("./pages/scanner/Scanner"));
const EquipmentReport = lazy(() => import("./pages/scanner/EquipmentReport"));
const EquipmentLibrary = lazy(() => import("./pages/equipment/EquipmentLibrary"));
const EquipmentDetail = lazy(() => import("./pages/equipment/EquipmentDetail"));
const TraneBrand = lazy(() => import("./pages/equipment/TraneBrand"));
const Catalogs = lazy(() => import("./pages/resources/Catalogs"));
const CatalogDetail = lazy(() => import("./pages/resources/CatalogDetail"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Lightweight loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

// Root layout component that includes global elements
const RootLayout = () => {
  const location = useLocation();
  useEffect(() => { loadGA4(); }, []);
  useEffect(() => { trackPageView(location.pathname + location.search); }, [location.pathname, location.search]);
  return (
    <>
      <ScrollToTop />
      <TrackingScripts />
      <CookieConsent />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </>
  );
};

const AdminRedirect = () => {
  useEffect(() => {
    window.location.replace("https://crm.truficient.com");
  }, []);
  return null;
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/about", element: <About /> },
      { path: "/about.html", element: <About /> },
      { path: "/services/residential", element: <ResidentialServices /> },
      { path: "/services/residential.html", element: <ResidentialServices /> },
      { path: "/services/commercial", element: <CommercialServices /> },
      { path: "/services/commercial.html", element: <CommercialServices /> },
      { path: "/services/ductless", element: <DuctlessServices /> },
      { path: "/services/ductless.html", element: <DuctlessServices /> },
      { path: "/residential-services", element: <ResidentialServices /> },
      { path: "/residential-services.html", element: <ResidentialServices /> },
      { path: "/commercial-services", element: <CommercialServices /> },
      { path: "/commercial-services.html", element: <CommercialServices /> },
      { path: "/contact", element: <Contact /> },
      { path: "/contact.html", element: <Contact /> },
      { path: "/service-areas", element: <ServiceAreasHub /> },
      { path: "/service-areas.html", element: <ServiceAreasHub /> },
      { path: "/service-areas/dallas-area", element: <DallasArea /> },
      { path: "/service-areas/dallas-area.html", element: <DallasArea /> },
      { path: "/service-areas/north-dallas-area", element: <NorthDallasArea /> },
      { path: "/service-areas/north-dallas-area.html", element: <NorthDallasArea /> },
      { path: "/service-areas/frisco-mckinney-area", element: <FriscoMcKinneyArea /> },
      { path: "/service-areas/frisco-mckinney-area.html", element: <FriscoMcKinneyArea /> },
      { path: "/service-areas/mid-cities-area", element: <MidCitiesArea /> },
      { path: "/service-areas/mid-cities-area.html", element: <MidCitiesArea /> },
      { path: "/service-areas/south-dallas-area", element: <SouthDallasArea /> },
      { path: "/service-areas/south-dallas-area.html", element: <SouthDallasArea /> },
      { path: "/service-areas/:clusterSlug", element: <ClusterSubHub /> },
      { path: "/hvac-estimate", element: <HvacEstimate /> },
      { path: "/heat-pump-advantage", element: <HeatPumpAdvantage /> },
      { path: "/estimators/sizing", element: <SizingCalculator /> },
      { path: "/estimators/cost", element: <CostEstimator /> },
      { path: "/estimators/savings", element: <SavingsCalculator /> },
      { path: "/estimate/smart-group-march", element: <SmartGroupEntry /> },
      { path: "/central-ac-estimate", element: <CentralAcEstimate /> },
      { path: "/mini-split-estimate", element: <MiniSplitEstimate /> },
      { path: "/multi-zone-estimate", element: <MultiZoneEstimate /> },
      { path: "/careers", element: <Careers /> },
      { path: "/careers.html", element: <Careers /> },
      { path: "/financing", element: <Financing /> },
      { path: "/financing.html", element: <Financing /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/privacy-policy.html", element: <PrivacyPolicy /> },
      { path: "/terms-of-service", element: <TermsOfService /> },
      { path: "/terms-of-service.html", element: <TermsOfService /> },
      { path: "/cookie-preferences", element: <CookiePreferences /> },
      
      { path: "/blog", element: <Blog /> },
      { path: "/blog.html", element: <Blog /> },
      { path: "/blog/:slug", element: <BlogPost /> },
      { path: "/category/:slug", element: <BlogCategory /> },
      { path: "/gallery", element: <Gallery /> },
      { path: "/gallery.html", element: <Gallery /> },
      { path: "/scanner", element: <Scanner /> },
      { path: "/scanner/report", element: <EquipmentReport /> },
      { path: "/equipment", element: <EquipmentLibrary /> },
      { path: "/equipment.html", element: <EquipmentLibrary /> },
      { path: "/equipment/trane", element: <TraneBrand /> },
      { path: "/equipment/*", element: <EquipmentDetail /> },
      { path: "/resources/catalogs", element: <Catalogs /> },
      { path: "/resources/catalogs/:slug", element: <CatalogDetail /> },
      { path: "/free-hvac-age-checker-fb-feb-2026", element: <FreeHvacAgeCheckerFB /> },
      { path: "/smart-group-march-F-26", element: <SmartGroupMarchLanding /> },
      { path: "/smart-group-march-F-26v2", element: <SmartGroupMarchV2Landing /> },
      { path: "/smart-group-march-G-26", element: <SmartGroupMarchGoogleLanding /> },
      
      { path: "/smart-group-march", element: <CampaignLandingPage /> },
      { path: "/smart-group-march-g", element: <CampaignLandingPage /> },
      
      { path: "/estimate/preview/:id", element: <PublicEstimatePreview /> },

      // Hand-built content page — MUST stay above the /:locationSlug catch-all,
      // or LocationPage will swallow it.
      { path: "/air-sealing-dallas-tx", element: <AirSealingDallas /> },

      { path: "/:locationSlug", element: <LocationPage /> },
      
      // The admin CRM lives on its own deployment now. The platform-level
      // 301 in vercel.json handles direct hits; this route covers client-side
      // navigations (old bookmarks, in-app history).
      { path: "/admin/*", element: <AdminRedirect /> },

      // Catch-all route
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
    <Analytics />
  </ThemeProvider>
);

export default App;
