import React from 'react';
import './App.css';
import DynamicForm from './components/DynamicForm';

class App extends React.Component {
    render(): React.ReactNode {
        return (
            <div className="app py-5">
                <DynamicForm />
            </div>
        );
    }
}

export default App;
