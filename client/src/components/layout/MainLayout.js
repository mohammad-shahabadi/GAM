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
import LanguageIcon from '@mui/icons-material/Language';
import {Menu, MenuItem} from "@mui/material";
import {usePathname} from "@/navigation";
import {Link} from "@/navigation";

const drawerWidth = 240;

export default function MainLayout({children, locale}) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorElLanguage, setAnchorElLanguage] = useState(null)

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
    const isLanguageMenuOpen = Boolean(anchorElLanguage)
    const pathname = usePathname()
    const drawer = (
        <div>
            <Toolbar/>
            <Divider/>
            <List>
                <ListItem disablePadding>
                    <Link style={pathname === "/admin"? {backgroundColor:"lightskyblue"}:{}} className={"w-full"} href={"/admin"}>
                        <ListItemButton>
                            <ListItemText sx={{textAlign: "start"}} primary={t('dashboard')}/>
                        </ListItemButton>
                    </Link>

                </ListItem>
                {['users', 'classes'].map((text, index) => (
                    <ListItem key={index} disablePadding>
                        <Link style={pathname === "/admin/"+text? {backgroundColor:"lightskyblue"}:{}} className={"w-full"} href={"/admin/"+text}>
                            <ListItemButton>
                                <ListItemText sx={{textAlign: "start"}} primary={t(text)}/>
                            </ListItemButton>
                        </Link>

                    </ListItem>
                ))}
            </List>
            <Divider/>
            <List>
                {['settings'].map((text, index) => (
                    <ListItem key={index} disablePadding>
                        <Link style={pathname === "/admin/"+text? {backgroundColor:"lightskyblue"}:{}} className={"w-full"} href={"/admin/"+text}>
                            <ListItemButton>
                                <ListItemText sx={{textAlign: "start"}} primary={t(text)}/>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
            </List>
        </div>
    );


    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                sx={locale.startsWith('fa') ? {mr: {sm: `${drawerWidth}px`}} : {
                    ml: {sm: `${drawerWidth}px`},
                    right: "auto"
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 2, display: {sm: 'none'}}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {t('title')}
                    </Typography>
                    <IconButton
                        size="large"
                        aria-label="Select a language"
                        aria-haspopup="true"
                        onClick={handleLanguageMenuOpen}
                        color="#ffffff">
                        <LanguageIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
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
                sx={{flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
            >
                <Toolbar/>
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


