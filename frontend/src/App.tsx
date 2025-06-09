import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { BucketPathProvider } from './context/bucketPathContext'
import { FileModeProvider } from './context/fileModeContext'
import { KeyModalProvider } from './context/keyModalContext'
import { KeyIdProvider } from './context/keyIdContext'
import { SecretKeyProvider } from './context/secretKeyContext'
import { RegionProvider } from './context/regionContext'
import { FetchingProvider } from './context/globalFetchingContext'

import Header from './components/Header/Header'
import Body from './components/Body/Body'
import KeyModal from './components/KeyModal'

import { composeProviders } from './lib/composeProviders'

import './App.css'

const ContextProviders = composeProviders(
	BucketPathProvider,
	FileModeProvider,
	KeyModalProvider,
	KeyIdProvider,
	SecretKeyProvider,
	RegionProvider,
	FetchingProvider,
)

function App() {
	return (
		<ContextProviders>
			<BrowserRouter>
				<Header />
				<KeyModal />

				<Routes>
					<Route path='/' element={<Body />} />
					<Route path='/:bucket-name/*' element={<Body />} />
				</Routes>
			</BrowserRouter>
		</ContextProviders>
	)
}

export default App
