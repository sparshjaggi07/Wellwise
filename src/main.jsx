import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globalStyles.css'
import RoutesConfig from './routes.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RoutesConfig />
	</StrictMode>,
)