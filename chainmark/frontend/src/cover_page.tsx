import React, {useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid2";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { motion } from "framer-motion";
import  "../useful.css";
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'rgba(255,255,255,0)',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const Cover_page:React.FC <{background_image_url:string|undefined}>=({background_image_url})=>{
    const [get_start_button,set_get_start_button]=useState(false);
    const [menu_button,set_menu_button]=useState({
        Home:false,
        about_us:false,
        roadmap:false
    })
    const background_image={
        backgroundImage:`url(${background_image_url == undefined?"https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg":background_image_url})`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment:"fixed",
        backgroundPosition: "top",
        backgroundSize: "100% 100%",
        zIndex:1,

    }

    return (
        <>
            <React.Fragment>
                <CssBaseline />
                <Container maxWidth="xl" sx={{overflow:"hidden"}}>
                    <Box sx={{
                        bgcolor: 'rgba(207,232,252,0.75)',
                        height: '100vh',
                        width: "100%",
                        paddingTop: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex"
                    }}>
                        <div style={{
                            filter: "brightness(60%)",
                            width: "inherit",
                            height: "inherit",
                            position: "absolute", ...background_image
                        }}></div>
                        <div style={{

                            width: "inherit",
                            height: "inherit",
                            position: "absolute",paddingLeft:"5%",paddingTop:"2vh"
                        }}>
                            <h1 style={{
                                margin: "5px 0",
                                fontSize: "25px",   // 設定字體大小
                                fontWeight: "normal", // 設定字體粗體
                                fontFamily: 'Arimo',  // 設定字體
                                letterSpacing: "1px",
                                color: "#fafafa",
                                position: "absolute",
                                justifyContent: "left",
                                alignSelf: "start",
                                zIndex: 3,
                                display: "flex"
                            }}>ChainMark</h1>
                        </div>
                        <Box sx={{
                            height: "4vh",
                            width: "30vmax",
                            display: "inline-grid",
                            justifySelf: "center",
                            alignSelf: "start",
                        }}>

                            <Grid container spacing={2} sx={{borderRadius: 5, zIndex: 2, paddingTop: 2}}>
                                <Grid size={4} sx={{backgroundColor: "rgba(200,200,200,0.16)", borderRadius: 1,}}>
                                    <motion.div className={"box"}
                                                whileHover={{scale: 1.03}}
                                                whileTap={{scale: 0.95}}
                                                transition={{type: "spring", stiffness: 400, damping: 25}}

                                    >
                                        <Item sx={{color: "rgba(227,225,225,0.93)"}} >Home</Item>
                                    </motion.div>
                                </Grid>
                                <Grid size={4} sx={{backgroundColor: "rgba(200,200,200,0.16)", borderRadius: 1}}>
                                    <motion.div className={"box"}
                                                whileHover={{scale: 1.03}}
                                                whileTap={{scale: 0.95}}
                                                transition={{type: "spring", stiffness: 400, damping: 25}}

                                    >
                                        <Item sx={{color: "rgba(227,225,225,0.96)"}}>About us</Item>
                                    </motion.div>
                                </Grid>
                                <Grid size={4} sx={{backgroundColor: "rgba(200,200,200,0.16)", borderRadius: 1}}>
                                    <motion.div className={"box"}
                                                whileHover={{scale: 1.03}}
                                                whileTap={{scale: 0.95}}
                                                transition={{type: "spring", stiffness: 400, damping: 25}}

                                    >
                                        <Item sx={{color: "rgba(227,225,225,0.93)"}}>Roadmap</Item>
                                    </motion.div>
                                </Grid>
                            </Grid>

                        </Box>
                        <div style={{
                            height: "30vh",
                            width: "100%",
                            zIndex: 3,
                            backgroundColor: "",
                            position: "absolute",
                            justifyContent: "left-start",
                            alignItems: "flex-start",
                            display: "flex",
                            flexDirection: "column",
                            paddingLeft: "10%"
                        }}>
                            <h1 style={{
                                margin: "5px 0",
                                fontSize: "40px",   // 設定字體大小
                                fontWeight: "bold", // 設定字體粗體
                                fontFamily: 'Arimo',  // 設定字體
                                letterSpacing: "5px",
                                color: "#fafafa"
                            }}>ChainMark</h1>
                            <p style={{
                                margin: "5px 0",
                                fontSize: "20px",   // 設定字體大小
                                fontWeight: "normal", // 設定字體粗體
                                fontFamily: 'Arimo',  // 設定字體
                                letterSpacing: "2px",
                                color: "#d5d5d5",
                                marginTop: "2vh"
                            }}> Time to alter the world by hosting a new data annotation way<br/>
                                to interact with the blockchain community.</p>
                            <motion.div className={"box"}
                                        style={{width:"37%"}}
                                        whileHover={{scale: 1.01}}
                                        whileTap={{scale: 0.98}}
                                        transition={{type: "spring", stiffness: 400, damping: 45}}

                            >
                                <button
                                    onMouseEnter={() => {
                                        set_get_start_button(true)
                                    }}
                                    onMouseLeave={() => {
                                        set_get_start_button(false)
                                    }}
                                    style={{
                                        margin: "5px 0",
                                        fontSize: "20px",   // 設定字體大小
                                        fontWeight: "normal", // 設定字體粗體
                                        fontFamily: 'Arimo',  // 設定字體
                                        letterSpacing: "2px",
                                        height: "5vh",
                                        width: "inherit",
                                        borderRadius: 5,
                                        backgroundColor: get_start_button ? "rgb(18,18,18)" : "rgba(223,223,223,0.38)",
                                        zIndex: 3,
                                        color: "#d5d5d5",
                                        marginTop: "2vh",
                                        position: "relative", // 為了讓光圈相對於按鈕定位
                                        overflow: "hidden",   // 隱藏按鈕外部的光圈
                                        transition: "all 0.3s ease",
                                        boxShadow: get_start_button
                                            ? "0 0 15px rgba(255, 255, 255, 0.5)"
                                            : "none", // 控制光圈的陰影效果
                                    }}> Get Start
                                </button>
                            </motion.div>


                        </div>
                        {/*<Box sx={{height:"30vh",width:"50%",zIndex:3,backgroundColor:"blue"}}>*/}

                        {/*</Box>*/}
                    </Box>
                    <Box sx={{bgcolor: "rgba(16,16,16,0.3)", height: "100vh"}}></Box>
                </Container>
            </React.Fragment>
        </>
    )
}

export {Cover_page}