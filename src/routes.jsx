import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./sections/home/home";
import Login from "./sections/auth/login/login";
import Register from "./sections/auth/register/register";
import PatientProfileBuilder from "./sections/auth/register/profileBuilder/patientProfileBuilder/patientProfile";
import DoctorProfileBuilder from "./sections/auth/register/profileBuilder/doctorProfileBuilder/doctorProfile";
import DispensaryProfileBuilder from "./sections/auth/register/profileBuilder/dispensaryProfileBuilder/dispensaryProfile";

import PatientDashboardLayout from "./sections/dashboard/patientDashboard/patientDashboardLayout";
import PatientHome from "./sections/dashboard/patientDashboard/pages/patientHome";
import PatientAppointments from "./sections/dashboard/patientDashboard/pages/patientAppointment";
import MentalHealthTest from "./sections/dashboard/patientDashboard/pages/mentalHealthTest/mhTest";
import PatientProfile from "./sections/dashboard/patientDashboard/pages/patientProfile";

import DoctorDashboard from "./sections/dashboard/doctorDashboard/doctorDashboard";
import DispensaryDashboard from "./sections/dashboard/dispensaryDashboard/dispensaryDashboard";

import Header from "./sections/navigation/header/header";
import Footer from "./sections/navigation/footer/footer";
import TestDashboard from "./sections/dashboard/patientDashboard/pages/mentalHealthTest/testDashboard";

import Report from "./sections/dashboard/patientDashboard/pages/mentalHealthTest/report";
import ChatBotComponent from "./sections/dashboard/patientDashboard/pages/chatBot";

function HomeRendering() {
    return (
        <>
            <Header />
            <Home />
            <Footer />
        </>
    )
}

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeRendering />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/patient/profile/:uniqueID" element={<PatientProfileBuilder />} />
                <Route path="/register/doctor/profile/:licenseNumber" element={<DoctorProfileBuilder />} />
                <Route path="/register/dispensary/profile/:licenseNumber" element={<DispensaryProfileBuilder />} />

                <Route path="/patient/:healthID" element={<PatientDashboardLayout />}>
                    <Route path='home' element={<PatientHome />} />
                    <Route path='appointments' element={<ChatBotComponent />} />
                    <Route path='profile' element={<PatientProfile />} />
                    <Route path="mht/:testID" element={<TestDashboard />}/>
                </Route>

                <Route path="/patient/:healthID/takeTest" element={<MentalHealthTest />}/>

                <Route path="/patient/ack/:healthID/:testID" element={<Report />}/>

                <Route path="/doctor/:licenseNumber" element={<DoctorDashboard />} />
                <Route path="/dispensary/:licenseNumber" element={<DispensaryDashboard />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;