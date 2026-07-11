import Seo from "@/components/Seo";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FaLeaf, FaTint, FaRecycle, FaTshirt } from "react-icons/fa";
import { MdHistory, MdTrendingUp, MdCheckCircle } from "react-icons/md";

const lifetimeData = [
  {
    label: "CO₂ avoided",
    value: "1.2 t",
    color: "#FFC107",
    icon: <FaLeaf className="text-2xl" />,
    description: "Equivalent to 2,800 km driven by car",
  },
  {
    label: "Water saved",
    value: "18k L",
    color: "#03A9F4",
    icon: <FaTint className="text-2xl" />,
    description: "Enough to fill 90 bathtubs",
  },
  {
    label: "Landfill reduced",
    value: "4.3 m³",
    color: "#8BC34A",
    icon: <FaRecycle className="text-2xl" />,
    description: "Equal to 70 large trash bins",
  },
  {
    label: "Items processed",
    value: "27",
    color: "#FF5722",
    icon: <FaTshirt className="text-2xl" />,
    description: "Donated, upcycled, or resold",
  },
];

const recentActivity = [
  { text: "Donation collected • 2 jackets, 1 pair of jeans", icon: <MdCheckCircle className="text-primary" /> },
  { text: "AI sorting complete • Recommended: Upcycle", icon: <MdCheckCircle className="text-primary" /> },
  { text: "Order shipped • Upcycled Denim Tote", icon: <MdCheckCircle className="text-primary" /> },
  { text: "New marketplace listing • Patchwork Jacket", icon: <MdCheckCircle className="text-primary" /> },
];

const upcomingGoals = [
  { goal: "Save 25k L of water", progress: 72 },
  { goal: "Avoid 2 t of CO₂ emissions", progress: 60 },
  { goal: "Reduce landfill by 6 m³", progress: 71 },
];

const impactTrends = [
  { month: "Jan", CO2: 0.3, Water: 4, Landfill: 1 },
  { month: "Feb", CO2: 0.6, Water: 7, Landfill: 1.5 },
  { month: "Mar", CO2: 0.9, Water: 12, Landfill: 2.3 },
  { month: "Apr", CO2: 1.1, Water: 15, Landfill: 3.2 },
  { month: "May", CO2: 1.2, Water: 18, Landfill: 4.3 },
];

const Impact = () => {
  return (
    <div className="min-h-screen bg-white text-primary-dark">
      <Seo
        title="Impact Dashboard — Nyuzi"
        description="Track CO₂, water, and landfill savings from your donations and purchases."
      />

      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl font-extrabold">Impact Dashboard</h1>
          <p className="mt-2 text-gray-700">
            Your contributions to a circular fashion economy are making a real difference.
          </p>
        </motion.div>

        {/* Lifetime Stats */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {lifetimeData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-xl bg-white text-black p-6 shadow-md flex flex-col items-center text-center border-2 border-primary hover:shadow-lg transition-all"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${item.color}22`, color: item.color }}
              >
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold">{item.value}</h3>
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
              <p className="mt-2 text-xs text-gray-500">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Goals */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 rounded-xl bg-white p-6 border-2 border-primary shadow-md"
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <MdTrendingUp className="text-primary" /> Upcoming Goals
          </h2>
          <div className="mt-6 space-y-6">
            {upcomingGoals.map((goal, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{goal.goal}</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="h-3 rounded-full bg-primary"
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>

          {/* Impact Trend Chart */}
          <div className="mt-10 h-64 bg-gray-50 rounded-xl p-4 border border-primary">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={impactTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis dataKey="month" stroke="hsl(var(--primary))" />
                <YAxis stroke="hsl(var(--primary))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--primary))", border: "none", color: "#fff" }} />
                <Line type="monotone" dataKey="CO2" stroke="hsl(var(--gold))" strokeWidth={2} dot />
                <Line type="monotone" dataKey="Water" stroke="#03A9F4" strokeWidth={2} dot />
                <Line type="monotone" dataKey="Landfill" stroke="#8BC34A" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Activity Feed & Why Impact Matters */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-xl bg-white p-6 border-2 border-primary shadow-md"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <MdHistory className="text-primary" /> Recent Activity
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              {recentActivity.map((activity, index) => (
                <li
                  key={index}
                  className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition flex items-center gap-2 border border-primary/40"
                >
                  {activity.icon} {activity.text}
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-xl bg-white p-6 border-2 border-primary shadow-md"
          >
            <h2 className="text-xl font-semibold">Why Your Impact Matters</h2>
            <p className="mt-4 text-sm text-gray-700">
              Every item you donate or purchase reduces demand for virgin
              materials, saves precious water, and prevents greenhouse gas
              emissions. Together, we are building a truly circular fashion
              economy.
            </p>
            <p className="mt-4 text-sm text-gray-700">
              Nyuzi ensures transparency by tracking the lifecycle of every
              item you interact with. Your personal dashboard is updated in
              real-time to show your tangible contributions.
            </p>
          </motion.section>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-12 text-center"
        >
          <h3 className="text-xl font-semibold text-primary">
            Keep up the momentum — every action counts!
          </h3>
          <button className="mt-4 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition">
            Make Another Contribution
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Impact;




