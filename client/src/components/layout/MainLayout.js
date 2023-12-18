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
import {useState} from "react";
import {useTranslations} from "next-intl";
import TranslateIcon from '@mui/icons-material/Translate';
import {Menu, MenuItem} from "@mui/material";
import {usePathname} from "@/navigation";
import {Link} from "@/navigation";
import useWindowSize from "@/hooks/useWindowSize";
import img1 from "../../assets/images/no-organization_prev_ui.png"
import Image from "next/image";
import Cookies from "js-cookie";
const drawerWidth = 200;

export default function MainLayout({children, locale}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorElLanguage, setAnchorElLanguage] = useState(null)
    const mode = useWindowSize()
    const t = useTranslations('Layout');
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
    console.log(token)
    const isLanguageMenuOpen = Boolean(anchorElLanguage)
    const pathname = usePathname()
    const drawer = (
        <div className={"bg-[var(--background)] min-h-screen !font-bold flex flex-col justify-between"}>
            <div>
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
                        className={"!fixed start-[150px] " + (mode === 1 ? "!hidden":"")}
                        size="large"
                        aria-label="Select a language"
                        aria-haspopup="true"
                        onClick={handleLanguageMenuOpen}
                        color="#ffffff">
                        <TranslateIcon/>
                    </IconButton>
                </Toolbar>
                <Divider/>
                <List>
                    <ListItem disablePadding>
                        <Link style={pathname === ("/" + token)? {backgroundColor:"#ff5733",color:"white"}:{}} className={"w-full"} href={("/" + token)}>
                            <ListItemButton>
                                <ListItemText sx={{textAlign: "start"}} primary={t('dashboard')}/>
                            </ListItemButton>
                        </Link>

                    </ListItem>
                    {(token === "admin" ? ['users', 'classes'] : ['classes']).map((text, index) => (
                        <ListItem key={index} disablePadding>
                            <Link style={pathname.startsWith(("/" + token+"/")+text)? {backgroundColor:"#ff5733",color:"white"}:{}} className={"w-full"} href={("/" + token+"/")+text}>
                                <ListItemButton>
                                    <ListItemText sx={{textAlign: "start"}} primary={t(text)}/>
                                </ListItemButton>
                            </Link>

                        </ListItem>
                    ))}
                </List>
                {/*<Divider/>*/}
                {/*<List>*/}
                {/*    {['settings'].map((text, index) => (*/}
                {/*        <ListItem key={index} disablePadding>*/}
                {/*            <Link style={pathname === "/admin/"+text? {backgroundColor:"#ff5733",color:"white"}:{}} className={"w-full"} href={"/admin/"+text}>*/}
                {/*                <ListItemButton>*/}
                {/*                    <ListItemText sx={{textAlign: "start"}} primary={t(text)}/>*/}
                {/*                </ListItemButton>*/}
                {/*            </Link>*/}
                {/*        </ListItem>*/}
                {/*    ))}*/}
                {/*</List>*/}
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


