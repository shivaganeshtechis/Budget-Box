import React from 'react';
import Router from './Router';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { LayoutProvider } from 'react-page-layout';
import DefaultLayout from './components/default/DefaultLayout';

const layouts = {
	'public': DefaultLayout,
};

function App() {
	return (
		<LayoutProvider layouts={layouts}>
			<BrowserRouter>
				<Router />
			</BrowserRouter>
		</LayoutProvider>
	);
}

export default App;