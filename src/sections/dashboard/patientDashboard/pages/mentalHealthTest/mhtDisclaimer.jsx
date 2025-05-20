import React from "react";
import { Link, useParams } from "react-router-dom";

function Disclaimer({handleAccept}) {
    const { healthID } = useParams();

    return (
        <>
            <div className="w-screen h-screen bg-[#e6eaf0] flex flex-row justify-center items-center">
                <div className="bg-white w-[1335px] p-8 sm:p-14 sm:rounded-[30px] sm:drop-shadow-lg">
                    <h1 className="text-4xl font-albulaHeavy text-gray-800 mb-4 text-center">
                        Mental Health Test <span className="text-rose-500">Disclaimer!</span>
                    </h1>
                    <p className="text-gray-600 font-albulaRegular mb-4 mt-16">
                        Welcome to the Mental Health Test. This assessment is designed to evaluate your mental well-being through a series of sections, including questions about your past experiences, a standard PHQ-9 questionnaire, sentiment analysis, and facial behavior analysis. The results aim to provide insights into your mental health status, particularly regarding depression.
                    </p>

                    <h2 className="text-2xl font-albulaSemiBold text-gray-800 mt-10 mb-3">How the Test Works</h2>
                    <ul className="list-disc list-inside text-gray-600 mb-4 font-albulaRegular">
                        <li>Section 1: Answer questions about your childhood and past experiences.</li>
                        <li>Section 2: Complete the PHQ-9 questionnaire to assess depression levels.</li>
                        <li>Section 3: Provide text and audio responses for sentiment analysis using AI.</li>
                        <li>Section 4: Enable your webcam for verbal answers and facial behavior analysis.</li>
                    </ul>

                    <h2 className="text-2xl font-albulaSemiBold text-gray-800 mt-10 mb-3">Key Information</h2>
                    <p className="text-gray-600 mb-4 font-albulaRegular">
                        - This test leverages AI and ML to assist doctors in providing better care by analyzing patient data before suggesting solutions.<br />
                        - Your data will be securely stored and analyzed under strict privacy protocols. Video and audio data are used solely for this test and will not be shared without your consent.<br />
                        - Participation in this test is completely voluntary. You can choose to exit at any time.<br />
                    </p>

                    <h2 className="text-2xl font-albulaSemiBold text-gray-800 mt-10 mb-3">Consent</h2>
                    <p className="text-gray-600 font-albulaRegular mb-4">
                        By proceeding, you confirm that you have read and understood this disclaimer and consent to participate in the test.
                    </p>

                    <div className="flex justify-end mt-10 gap-5">
                        <Link to={`/patient/${healthID}/home`} className="text-red-500 px-6 py-3 rounded font-albulaBold hover:text-red-700 transition-all ease-in-out" >
                            Decline
                        </Link>
                        <button className="bg-[#609c9c] text-white px-6 py-3 rounded-xl font-albulaBold hover:bg-[#266666] transition-all ease-in-out" onClick={handleAccept} >
                            Accept & Proceed
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Disclaimer;