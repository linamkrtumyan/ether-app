import Layout from "./layout";

declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  return (
    <div className="h-screen bg-slate-900">
      <Layout />
    </div>
  );
}

export default App;
