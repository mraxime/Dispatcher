import AccountBoxOutlined from '@mui/icons-material/AccountBoxOutlined';
import ArrowBack from '@mui/icons-material/ArrowBack';
import BuildCircleOutlined from '@mui/icons-material/BuildCircleOutlined';
import CallOutlined from '@mui/icons-material/CallOutlined';
import ChatBubbleOutlined from '@mui/icons-material/ChatBubbleOutlined';
import ContactPageOutlined from '@mui/icons-material/ContactPageOutlined';
import DirectionsCarFilledOutlined from '@mui/icons-material/DirectionsCarFilledOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import ReceiptOutlined from '@mui/icons-material/ReceiptOutlined';
import Refresh from '@mui/icons-material/Refresh';
import Search from '@mui/icons-material/Search';
import SquareFootOutlined from '@mui/icons-material/SquareFootOutlined';
import {
	ArrowRight,
	Bell,
	Briefcase,
	Calendar,
	X as Close,
	DollarSign,
	Edit,
	Mail,
	Menu,
	MoreHorizontal,
	MoreVertical,
	Plus,
	Send,
	Settings,
	Trash,
	Truck,
	User,
} from 'react-feather';

/**
 * Centralized list of icons to use in the application.
 * Makes consistency and management easier.
 *
 * Example usage: `<Icons.user />`
 */
export const Icons = {
	add: Plus,
	back: ArrowBack,
	bill: ReceiptOutlined,
	calendar: Calendar,
	call: CallOutlined,
	chat: ChatBubbleOutlined,
	client: AccountBoxOutlined,
	close: Close,
	company: Briefcase,
	contact: ContactPageOutlined,
	delete: Trash,
	edit: Edit,
	goto: ArrowRight,
	location: LocationOnOutlined,
	mail: Mail,
	measure: SquareFootOutlined,
	menu: Menu,
	more: MoreHorizontal,
	moreVertical: MoreVertical,
	notification: Bell,
	price: DollarSign,
	refresh: Refresh,
	search: Search,
	send: Send,
	service: BuildCircleOutlined,
	settings: Settings,
	trailer: Truck,
	user: User,
	vehicle: DirectionsCarFilledOutlined,
};
