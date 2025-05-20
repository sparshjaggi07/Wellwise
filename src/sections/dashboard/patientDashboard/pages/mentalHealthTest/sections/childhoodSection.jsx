import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import MentalHealth from '../../../../../../build/contracts/MentalHealth.json';

function ChildhoodSection({ step, patientDetails, tID }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [totalScore, setTotalScore] = useState(0);

    const questions = [
        {
            text: "Do you have a family history of depression or other mental health disorders? If yes, please specify.",
            options: ["No", "Yes, a distant relative", "Yes, an immediate family member"],
            image: "public/illustration/Screenshot_2025-01-11_at_8.07.47_PM-removebg-preview.png"
        },
        {
            text: "Have you experienced any significant life changes or stressful events recently, such as job loss, family issues, or relationship problems?",
            options: ["No, nothing significant", "Yes, a minor event", "Yes, a major event"],
            image: "public/illustration/relationshipProblems.jpg"
        },
        {
            text: "How have your sleep patterns been over the past few weeks? (e.g., difficulty falling asleep, staying asleep, or oversleeping)",
            options: ["I sleep well and feel rested", "I have trouble falling asleep or staying asleep", "I sleep very little or excessively"],
            image: "public/animations/sleep.gif"
        },
        {
            text: "Have you noticed any significant changes in your appetite or eating habits recently?",
            options: ["No, my appetite is normal", "I eat more or less than usual", "I have lost or gained significant weight recently"],
            image: "public/illustration/food.jpg",
        },
        {
            text: "Did you experience bullying or social isolation during your school years? If so, how did it affect you emotionally or socially?",
            options: ["No, I was well-liked", "A little, but it didn’t affect me much", "Yes, it had a lasting emotional impact"],
            image: "public/illustration/bully.png"
        },
        {
            text: "Do you have a reliable support system of family or friends to talk to when feeling down or stressed?",
            options: ["Yes, I have a strong support system", "I have some support, but it’s limited", "I feel isolated and have no one to talk to"],
            image: "public/illustration/family.png"
        },
        {
            text: "Do you use substances such as alcohol, recreational drugs, or certain medications to cope with stress or emotions? If yes, how frequently?",
            options: ["No, I don’t use substances", "Occasionally, but not regularly", "Yes, heavily"],
            image: "public/animations/Alcohol.gif"
        }
    ];

    const handleAnswerChange = (value, score) => {
        const questionKey = `question${currentQuestion + 1}`;
        const oldScore = answers[questionKey]?.score || 0;

        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionKey]: { value, score }
        }));
        setTotalScore((prevScore) => prevScore - oldScore + score);
        setSelectedAnswer(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const normalizedScore = totalScore / 14.0;

        if (!window.ethereum) {
            alert('Please install MetaMask to use this feature.');
            return;
        }

        try {
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();

            if (!MentalHealth.networks[networkId]) {
                alert('Contract not deployed on the current network.');
                return;
            }

            const contract = new web3.eth.Contract(
                MentalHealth.abi,
                MentalHealth.networks[networkId].address
            );

            await contract.methods
                .initializeChildhoodDetails(
                    tID,
                    answers.question1?.value || '',
                    answers.question2?.value || '',
                    answers.question3?.value || '',
                    answers.question4?.value || '',
                    answers.question5?.value || '',
                    answers.question6?.value || '',
                    answers.question7?.value || '',
                    normalizedScore.toString()
                )
                .send({ from: patientDetails.walletAddress });

            console.log('Childhood & Past Experiences Submitted Successfully');
            step(2);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while storing Childhood & Past Experiences.');
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            const nextQuestionKey = `question${currentQuestion + 2}`;
            setSelectedAnswer(answers[nextQuestionKey]?.value || '');
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
            const prevQuestionKey = `question${currentQuestion}`;
            setSelectedAnswer(answers[prevQuestionKey]?.value || '');
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="w-full h-full p-10 mx-auto font-sans">
            <div className="w-full h-full bg-white rounded-lg overflow-hidden flex flex-col justify-between">
                <div>
                    <div className="p-6">
                        <h2 className="text-3xl font-albulaHeavy text-gray-800 mb-6">
                            Childhood and Past Experience
                        </h2>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                            <div
                                className="bg-[#266666] h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-2xl font-albulaBold text-gray-700 mt-20 mb-10">
                            {questions[currentQuestion].text}
                        </p>
                        <div className="space-y-4">
                            {questions[currentQuestion].options.map((option, index) => (
                                <div key={index} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={option}
                                        name="answer"
                                        value={option}
                                        checked={selectedAnswer === option}
                                        onChange={() => handleAnswerChange(option, index)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                                        aria-label={option}
                                    />
                                    <label
                                        htmlFor={option}
                                        className="ml-2 font-albulaRegular text-gray-700 text-2xl"
                                    >
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <img src={questions[currentQuestion].image} alt="" />

                <div className="bg-[#eef8f7] rounded-3xl px-6 py-4 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        Question {currentQuestion + 1} of {questions.length}
                    </p>
                    <div className="flex space-x-4">
                        <button
                            onClick={handleBack}
                            disabled={currentQuestion === 0}
                            className="px-4 py-2 rounded-xl text-slate-600 font-albulaBold disabled:hidden"
                        >
                            Back
                        </button>
                        {currentQuestion === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedAnswer}
                                className={`px-10 py-2 rounded-xl text-white font-albulaBold transition-colors duration-300 ${
                                    selectedAnswer ? 'bg-[#609c9c] hover:bg-[#266666]' : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                SUBMIT
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={!selectedAnswer}
                                className={`px-4 py-2 rounded-xl text-white font-albulaBold transition-colors duration-300 ${
                                    selectedAnswer ? 'bg-[#609c9c] hover:bg-[#266666]' : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChildhoodSection;