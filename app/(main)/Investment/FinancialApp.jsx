"use client";

import { useEffect, useState } from "react";

export default function FinancialApp() {
  const [activeTab, setActiveTab] = useState("stockRecommendations");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [results, setResults] = useState(null);
  const [allStocks, setAllStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [portfolioType, setPortfolioType] = useState("moderate");

  const [investmentAmountNumber, setInvestmentAmountNumber] = useState(0);
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://financial-server-9zb8.onrender.com/api/stock-recommendations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: investmentAmountNumber,
          }),
        }
      );

      console.log(response);
      const data = await response.json();
      if (data.success) {
        setResults({
          investmentAmount: data.investmentAmount,
          category: data.category,
          recommendations: data.recommendations,
          portfolioSuggestion: data.portfolioSuggestion,
        });
      } else {
        console.log("main");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchAllStocks = async () => {
    try {
      const res = await fetch(
        "https://financial-server-9zb8.onrender.com/api/all-stocks"
      );
      const data = await res.json();
      if (data.success) {
        setAllStocks(data.stocks);
      }
    } catch (error) {
      console.error("Error fetching all stocks:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "allStocks" && allStocks.length === 0) {
      fetchAllStocks();
    }
  }, [activeTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!investmentAmount) return;
    fetchRecommendations();
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value) {
      const number = parseInt(value, 10);
      setInvestmentAmountNumber(number); // store as number
      setInvestmentAmount(number.toLocaleString("en-IN")); // store formatted string for display
    } else {
      setInvestmentAmount("");
      setInvestmentAmountNumber(0);
    }
  };

  const formatRiskLabel = (risk) => {
    const classes = {
      Low: "bg-green-100 text-green-800",
      "Low-Medium": "bg-teal-100 text-teal-800",
      Medium: "bg-blue-100 text-blue-800",
      "Medium-High": "bg-orange-100 text-orange-800",
      High: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${classes[risk] || "bg-gray-100 text-gray-800"}`}
      >
        {risk}
      </span>
    );
  };

  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [income, setIncome] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [investmentAmounts, setInvestmentAmounts] = useState("");
  const [loanResult, setLoanResult] = useState(null);

  const handleLoanCalculation = async () => {
    try {
      const response = await fetch(
        "https://financial-server-9zb8.onrender.com/api/loan-evaluation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(investmentAmounts),
            income: parseFloat(income),
            loanAmount: parseFloat(loanAmount),
            creditScore: parseInt(creditScore),
            loanTerm: parseFloat(tenure),
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setLoanResult(data);
      } else {
        console.error("Calculation failed:", data.error);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <div className="min-h-screen mt-[-50px] bg-gray-50">
      <header className="bg-indigo-700 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-center items-center">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-indigo-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h1 className="ml-2 text-2xl font-bold text-white">
                Indian Stock Advisor
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b flex">
            {["stockRecommendations", "loanCalculator", "allStocks"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-4 font-medium text-sm ${activeTab === tab ? "text-indigo-700 border-b-2 border-indigo-700" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {tab === "stockRecommendations"
                    ? "Stock Recommendations"
                    : tab === "loanCalculator"
                      ? "Loan Calculator"
                      : "All Stocks"}
                </button>
              )
            )}
          </div>

          {activeTab === "stockRecommendations" && (
            <div className="p-6">
              <form
                onSubmit={handleSubmit}
                className="space-y-6 max-w-xl mx-auto"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Amount (INR)
                  </label>
                  <input
                    type="text"
                    value={investmentAmount}
                    onChange={handleAmountChange}
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portfolio Type
                  </label>
                  <div className="flex gap-3">
                    {["conservative", "moderate", "aggressive"].map((type) => (
                      <div
                        key={type}
                        onClick={() => setPortfolioType(type)}
                        className={`cursor-pointer px-4 py-2 border rounded ${portfolioType === type ? "bg-indigo-100 border-indigo-600 text-indigo-800" : "border-gray-300"}`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                >
                  {loading ? "Processing..." : "Get Recommendations"}
                </button>
              </form>

              {results && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold">
                    Investment: {results.investmentAmount}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Portfolio Suggestion:{" "}
                    {results.portfolioSuggestion[portfolioType]}
                  </p>

                  <table className="min-w-full divide-y divide-gray-300 bg-white shadow rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Stock</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        <th className="px-4 py-2 text-left">Risk</th>
                        <th className="px-4 py-2 text-right">Shares</th>
                        <th className="px-4 py-2 text-right">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.recommendations.map((stock) => (
                        <tr key={stock.symbol} className="border-t">
                          <td className="px-4 py-2">
                            {stock.symbol}{" "}
                            <div className="text-sm text-gray-500">
                              {stock.name}
                            </div>
                          </td>
                          <td className="px-4 py-2">{stock.price}</td>
                          <td className="px-4 py-2">
                            {formatRiskLabel(stock.risk)}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {stock.maxShares}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {stock.percentOfTotal}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "allStocks" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                All Available Stocks
              </h2>
              <table className="min-w-full divide-y divide-gray-300 bg-white shadow rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Symbol</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Risk</th>
                    <th className="px-4 py-2 text-left">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {allStocks.map((stock) => (
                    <tr key={stock.symbol} className="border-t">
                      <td className="px-4 py-2">{stock.symbol}</td>
                      <td className="px-4 py-2">{stock.name}</td>
                      <td className="px-4 py-2">
                        {formatRiskLabel(stock.risk)}
                      </td>
                      <td className="px-4 py-2">{stock.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "loanCalculator" && (
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Loan Evaluation Calculator
              </h2>

              <p className="text-gray-600">
                This feature helps evaluate loan applications and recommend
                investment options.
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm text-gray-700">
                    Income (₹)
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">
                    Loan Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">
                    Credit Score
                  </label>
                  <input
                    type="number"
                    value={creditScore}
                    onChange={(e) => setCreditScore(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">
                    Loan Tenure (years)
                  </label>
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">
                    Investment Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={investmentAmounts}
                    onChange={(e) => setInvestmentAmounts(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              <button
                onClick={handleLoanCalculation}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Evaluate Loan
              </button>

              {loanResult && (
                <div className="mt-6 border rounded p-4 bg-gray-50 space-y-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Loan Evaluation Summary
                  </h3>
                  <p>
                    <strong>Loan Amount:</strong> {loanResult.loanAmount}
                  </p>
                  <p>
                    <strong>Loan Risk:</strong> {loanResult.loanEvaluation}
                  </p>
                  <p>
                    <strong>Interest Rate:</strong> {loanResult.interestRate}
                  </p>
                  <p>
                    <strong>Loan to Income Ratio:</strong>{" "}
                    {loanResult.loanToIncome}
                  </p>
                  <p>
                    <strong>Monthly Payment:</strong>{" "}
                    {loanResult.monthlyPayment}
                  </p>

                  <h4 className="font-semibold mt-4">
                    Investment Recommendations
                  </h4>
                  <p>
                    <strong>Category:</strong> {loanResult.category}
                  </p>
                  <ul className="list-disc ml-6">
                    {loanResult.recommendations.map((stock, index) => (
                      <li key={index}>
                        {stock.symbol}: {stock.quantity} shares at {stock.price}{" "}
                        each (Total: {stock.totalInvestment})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Why Choose Our Stock Advisor?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Indian Stock Focus
              </h3>
              <p className="text-gray-600">
                Specialized recommendations for the Indian stock market, with
                NSE-listed securities.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Real-time Updates
              </h3>
              <p className="text-gray-600">
                Get the latest market information and stock recommendations
                updated in real-time.
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Risk Assessment
              </h3>
              <p className="text-gray-600">
                Each recommendation comes with a thorough risk assessment to
                match your investment profile.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <footer className="bg-gray-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <h2 className="text-white font-bold text-xl">
                Indian Stock Advisor
              </h2>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-gray-400 text-sm">
                &copy; 2025 Indian Stock Advisor. All rights reserved. Not
                financial advice.
              </p>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
