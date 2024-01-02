"use client"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import TranslateIcon from '@mui/icons-material/Translate';
import {Menu, MenuItem, Paper} from "@mui/material";
import {usePathname, useRouter} from "@/navigation";
import {Link} from "@/navigation";
import useWindowSize from "@/hooks/useWindowSize";
import img1 from "../../assets/images/no-organization_prev_ui.png"
import Image from "next/image";
import Cookies from "js-cookie";
import {useParams, useSearchParams} from "next/navigation";
import {router} from "next/client";
import {useRequest} from "@/hooks/useRequest";
import {GET_QS} from "@/apiList";
const drawerWidth = 200;

export default function MainLayout({children, locale}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorElLanguage, setAnchorElLanguage] = useState(null)
    const mode = useWindowSize()
    const t = useTranslations('Layout');
    const [Qs, setQs] = useState([])

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const handleLanguageMenuOpen = (event) => {
        setAnchorElLanguage(event.currentTarget)
    }
    const handleMenuClose = () => {
        setAnchorElLanguage(null)
    }
    const token = Cookies.get('gam-authorities');
    const isLanguageMenuOpen = Boolean(anchorElLanguage)
    const pathname = usePathname()
    const params = useParams()
    console.log(params)
    const [getQsReq] = useRequest(GET_QS, "GET");
    const getQs = ()=>{
        getQsReq(undefined, [
            {name: "id", value: params.hw_id},
        ]).then((res) => {
            console.log(res)
            setQs(res.results)
        })
    }
    useEffect(() => {
        if(params.q_id && params.hw_id){
            getQs()
        }

    }, [params])
    const drawer = (
        <div className={"bg-[var(--background)] overflow-x-hidden overflow-auto h-screen !font-bold flex flex-col justify-between"}>
            <div >
                <Toolbar className={"relative"}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{me: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography className={"!mx-2"} variant="h5" noWrap component="div">
                        {t('title')}
                    </Typography>
                    <IconButton
                        className={"!absolute start-[150px] " + (mode === 1 ? "!hidden":"")}
                        size="large"
                        aria-label="Select a language"
                        aria-haspopup="true"
                        onClick={handleLanguageMenuOpen}
                        color="#ffffff">
                        <TranslateIcon/>
                    </IconButton>
                </Toolbar>
                <Divider/>
                <div>
                    <div className={"mb-4 pb-4 border border-b-gray-400"}>
                        <div style={pathname === ("/" + token)? {backgroundColor:"#ff5733",color:"white"}:{}} className={"py-4 px-2 cursor-pointer hover:bg-[#ff5733] hover:text-white"} >
                            <Link  className={"w-full"} href={("/" + token)}>
                                <button>
                                    {t('dashboard')}
                                </button>
                            </Link>

                        </div>
                        {(token === "admin" ? ['users', 'classes'] : ['classes']).map((text, index) => (
                            <div style={pathname.startsWith(("/" + token+"/")+text)? {backgroundColor:"#ff5733",color:"white"}:{}} className={"py-4 px-2 cursor-pointer hover:bg-[#ff5733] hover:text-white "} key={index} >
                                <Link  className={"w-full"} href={("/" + token+"/")+text}>
                                    <div>
                                        {t(text)}
                                    </div>
                                </Link>

                            </div>
                        ))}
                    </div>
                    {(params.q_id && token === "user") && <div>

                        <div className={"px-2 py-1.5"}>{t('questions')}</div>
                        {Qs.map((q, index) => (
                            <div style={params.q_id == q.id ? {color:"#ff5733"}:{}} className={"py-2 px-8 text-md cursor-pointer !font-medium hover:text-[#ff5733]"} key={index} >
                                <Link  className={"w-full"} href={`/user/classes/${params.slug}/homework/${params.hw_id}/questions/${q.id}`}>
                                    <div>
                                        {q?.title}
                                    </div>
                                </Link>
                            </div>
                        ))}

                    </div>}
                    {(params.hw_id) &&
                        <div className={"flex flex-col"}>
                            <Link href={`/${token}/classes/${params.slug}/homework/${params.hw_id}/submissions`} className={"px-2 py-1.5 cursor-pointer"}>Submissions</Link>
                            <Link href={`/${token}/classes/${params.slug}/homework/${params.hw_id}/final_submissions`} className={"px-2 pt-1.5 cursor-pointer"}>Final Submissions</Link>
                        </div>

                    }
                </div>

            </div>
            <div className={"w-full flex items-center justify-center mb-4"}>
                <Image width={150} height={150} src={img1.src} alt={"img1"}/>
            </div>

        </div>
    );


    return (
        <Box  sx={mode ===1?{backgroundColor:"inherit"}:{backgroundColor:"inherit",display: 'flex'}}>
            <CssBaseline/>
            { mode ===1 && <AppBar
                className={"!bg-[var(--background)] !text-black"}
                position="fixed"
                sx={locale.startsWith('fa') ? {mr: {sm: `${drawerWidth}px`}} : {
                    ml: {sm: `${drawerWidth}px`},
                    right: "auto"
                }}
            >
                <Toolbar className={"relative"}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mx: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography className={"mx-2"} variant="h5" noWrap component="div">
                        {t('title')}
                    </Typography>
                    <IconButton
                        className={"!fixed end-0"}
                        size="large"
                        aria-label="Select a language"
                        aria-haspopup="true"
                        onClick={handleLanguageMenuOpen}
                        color="#ffffff">
                        <TranslateIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>}
            <Box
                component="nav"
                sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
            >
                <Drawer
                    anchor={locale.startsWith('fa') ? "right" : "left"}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {xs: 'block', sm: 'none'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    anchor={locale.startsWith('fa') ? "right" : "left"}
                    variant="permanent"
                    sx={{
                        display: {xs: 'none', sm: 'block'},
                        '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`,marginTop:mode === 1 ?"54px":"0"}}}
            >
                {children}
            </Box>
            <Menu
                anchorEl={anchorElLanguage}
                keepMounted
                open={isLanguageMenuOpen}
                onClose={handleMenuClose}>

                <Link href={pathname} locale={'en'} >
                    <MenuItem onClick={handleMenuClose}>
                        English
                    </MenuItem>
                </Link>
                <Link href={pathname} locale={'fa'} >
                    <MenuItem onClick={handleMenuClose}>
                        فارسی
                    </MenuItem>
                </Link>
            </Menu>
        </Box>
    );
}


