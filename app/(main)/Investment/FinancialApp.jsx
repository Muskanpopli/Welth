"use client";

import { useEffect, useState } from "react";

export default function FinancialApp() {
  const [activeTab, setActiveTab] = useState("stockRecommendations");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [results, setResults] = useState(null);
  const [allStocks, setAllStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [portfolioType, setPortfolioType] = useState("moderate");
  const [investmentAmountNumber, setInvestmentAmountNumber] = useState(0);

  // Loan calculator state
  const [loanAmount, setLoanAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [income, setIncome] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [investmentAmounts, setInvestmentAmounts] = useState("");
  const [loanResult, setLoanResult] = useState(null);
  const [loanLoading, setLoanLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://financial-server-9zb8.onrender.com/api/stock-recommendations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: investmentAmountNumber,
            category: portfolioType,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setResults({
          investmentAmount: data.investmentAmount,
          investmentLevel: data.investmentLevel,
          riskCategory: data.riskCategory,
          recommendations: data.recommendations,
          portfolioGuidelines: data.portfolioGuidelines,
        });
      } else {
        setError(data.error || "Failed to fetch recommendations");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStocks = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://financial-server-9zb8.onrender.com/api/all-stocks"
      );
      const data = await res.json();
      if (data.success) {
        setAllStocks(data.stocks);
      } else {
        setError("Failed to fetch stocks data");
      }
    } catch (error) {
      console.error("Error fetching all stocks:", error);
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "allStocks" && allStocks.length === 0) {
      fetchAllStocks();
    }
  }, [activeTab, allStocks.length]);

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
    // Normalize risk text to handle case inconsistencies
    const normalizedRisk = typeof risk === "string" ? risk.toLowerCase() : "";

    const classes = {
      low: "bg-green-100 text-green-800",
      "low-medium": "bg-teal-100 text-teal-800",
      medium: "bg-blue-100 text-blue-800",
      "medium-high": "bg-orange-100 text-orange-800",
      high: "bg-red-100 text-red-800",
    };

    const displayRisk = typeof risk === "string" ? risk : "Unknown";
    const riskClass = classes[normalizedRisk] || "bg-gray-100 text-gray-800";

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${riskClass}`}
      >
        {displayRisk}
      </span>
    );
  };

  const handleLoanCalculation = async () => {
    if (
      !income ||
      !loanAmount ||
      !creditScore ||
      !tenure ||
      !investmentAmounts
    ) {
      setError("Please fill in all loan calculator fields");
      return;
    }

    setLoanLoading(true);
    setError(null);

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
        setError(data.error || "Calculation failed");
      }
    } catch (error) {
      console.error("API error:", error);
      setError("Network error. Please try again later.");
    } finally {
      setLoanLoading(false);
    }
  };

  // Show portfolio description based on the selected type
  const getPortfolioDescription = () => {
    if (!results?.portfolioGuidelines) return "";
    return results.portfolioGuidelines[portfolioType] || "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b flex">
            {["stockRecommendations", "loanCalculator", "allStocks"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setError(null);
                  }}
                  className={`px-4 py-4 font-medium text-sm ${
                    activeTab === tab
                      ? "text-indigo-700 border-b-2 border-indigo-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
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

          {/* Stock Recommendations Tab */}
          {activeTab === "stockRecommendations" && (
            <div className="p-6">
              <form
                onSubmit={handleSubmit}
                className="space-y-6 max-w-xl mx-auto"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Amount (₹)
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
                        className={`cursor-pointer px-4 py-2 border rounded ${
                          portfolioType === type
                            ? "bg-indigo-100 border-indigo-600 text-indigo-800"
                            : "border-gray-300"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 rounded-md ${
                    loading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Get Recommendations"
                  )}
                </button>
              </form>

              {results && (
                <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Investment Summary
                    </h3>
                    <div className="mt-4 grid md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">
                          Investment Amount
                        </p>
                        <p className="text-lg font-medium">
                          {results.investmentAmount}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">
                          Investment Level
                        </p>
                        <p className="text-lg font-medium capitalize">
                          {results.investmentLevel}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Risk Category</p>
                        <p className="text-lg font-medium capitalize">
                          {results.riskCategory}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
                    <h4 className="font-medium text-indigo-800">
                      Portfolio Guideline
                    </h4>
                    <p className="text-indigo-700 mt-1">
                      {getPortfolioDescription()}
                    </p>
                  </div>

                  <h4 className="text-lg font-semibold mb-3">
                    Recommended Stocks
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300 bg-white shadow rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Risk
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Max Shares
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Investment
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            % of Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {results.recommendations &&
                          results.recommendations.map((stock, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-900">
                                  {stock.symbol}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {stock.name}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-900">
                                {stock.price}
                              </td>
                              <td className="px-4 py-3">
                                {formatRiskLabel(stock.risk)}
                              </td>
                              <td className="px-4 py-3 text-right font-medium text-gray-900">
                                {stock.maxShares}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-900">
                                {stock.totalInvestment}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-900">
                                {stock.percentOfTotal}%
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* All Stocks Tab */}
          {activeTab === "allStocks" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                All Available Stocks
              </h2>

              {loading ? (
                <div className="flex justify-center py-12">
                  <svg
                    className="animate-spin h-10 w-10 text-indigo-600"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-300 bg-white shadow rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Symbol
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Risk
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allStocks.map((stock, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {stock.symbol}
                          </td>
                          <td className="px-4 py-3 text-gray-900">
                            {stock.name}
                          </td>
                          <td className="px-4 py-3">
                            {formatRiskLabel(stock.risk)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900">
                            {typeof stock.price === "number"
                              ? `₹${stock.price.toLocaleString("en-IN")}`
                              : stock.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {allStocks.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No stocks available at the moment.
                </div>
              )}
            </div>
          )}

          {/* Loan Calculator Tab */}
          {activeTab === "loanCalculator" && (
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Loan Evaluation Calculator
              </h2>

              <p className="text-gray-600">
                This calculator helps evaluate loan applications and recommend
                investment options based on your financial profile.
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Income (₹)
                  </label>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="50,000"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="500,000"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credit Score
                  </label>
                  <input
                    type="number"
                    value={creditScore}
                    onChange={(e) => setCreditScore(e.target.value)}
                    placeholder="750"
                    min="300"
                    max="900"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Tenure (years)
                  </label>
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    placeholder="5"
                    min="1"
                    max="30"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={investmentAmounts}
                    onChange={(e) => setInvestmentAmounts(e.target.value)}
                    placeholder="100,000"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={handleLoanCalculation}
                disabled={loanLoading}
                className={`mt-4 px-4 py-2 rounded ${
                  loanLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white`}
              >
                {loanLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Evaluate Loan"
                )}
              </button>

              {loanResult && (
                <div className="mt-6 border rounded-lg overflow-hidden">
                  <div className="bg-indigo-50 p-4 border-b">
                    <h3 className="font-semibold text-lg text-indigo-800">
                      Loan Evaluation Summary
                    </h3>
                  </div>

                  <div className="p-4 bg-white">
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500">Loan Amount</p>
                        <p className="text-lg font-medium">
                          {loanResult.loanAmount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Interest Rate</p>
                        <p className="text-lg font-medium">
                          {loanResult.interestRate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Monthly Payment</p>
                        <p className="text-lg font-medium">
                          {loanResult.monthlyPayment}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Loan to Income Ratio
                        </p>
                        <p className="text-lg font-medium">
                          {loanResult.loanToIncome}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          loanResult.loanEvaluation === "Low Risk"
                            ? "bg-green-100 text-green-800"
                            : loanResult.loanEvaluation === "Medium Risk"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {loanResult.loanEvaluation}
                      </div>
                    </div>

                    <h4 className="font-semibold text-lg mb-3">
                      Investment Recommendations
                    </h4>
                    <p className="mb-3">
                      <span className="font-medium">Category:</span>{" "}
                      <span className="capitalize">{loanResult.category}</span>
                    </p>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-300 bg-white shadow rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Symbol
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {loanResult.recommendations.map((stock, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-4 py-3 font-medium text-gray-900">
                                {stock.symbol}
                              </td>
                              <td className="px-4 py-3">{stock.price}</td>
                              <td className="px-4 py-3 text-right">
                                {stock.quantity}
                              </td>
                              <td className="px-4 py-3 text-right font-medium">
                                {stock.totalInvestment}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
