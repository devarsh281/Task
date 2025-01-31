import React from "react";

class ErrorBoundary extends React.Component {
    state = { hasError: false, errorMessage: "" };
  
    static getDerivedStateFromError() {
      return { hasError: true };
    }
  
    componentDidCatch(error: Error, info: React.ErrorInfo) {
      this.setState({ errorMessage: error.message });
      console.error("Error caught in Error Boundary:", error, info);
    }
  
    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong: {this.state.errorMessage}</h1>;
      }
    //   return this.props.childre;
    }
  }
  
export default ErrorBoundary;