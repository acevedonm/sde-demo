import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Container, Box } from '@mui/material';

export default function FeatureCards() {

    const features = [
        {
            title: "Carga de Expedientes",
            description: "Carga tus expedientes con un solo click",
            imageUrl: "/assets/Carga.jpg",
            href: "/upload",
            available: true
        },
        {
            title: "Busqueda",
            description: "Busca tus expedientes con un solo click",
            imageUrl: "/assets/Busqueda.jpg",
            href: "/search",
            available: true
        },
        {
            title: "Dashboard",
            description: "Ingresa al dashboard",
            imageUrl: "/assets/Archivo.jpg",
            href: "/search",
            available: false
        },
    ];

    return (
        <Container maxWidth={false} sx={{ width: '95%', mt: 5 }}>
            <Grid container spacing={2} columns={{ xs: 1, sm:1 ,md: 3 }}>
                {features.map((feature) => (
                    <Grid key={feature.title} xs={1}>
                        <Box sx={{ position: 'relative' }}>
                            <Card sx={{ opacity: feature.available ? 1 : 0.4 }}>
                                <CardActionArea href={feature.available ? feature.href : '#'} disabled={!feature.available}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={feature.imageUrl}
                                        alt={feature.title}
                                        sx={{ objectFit: 'fill'}}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                            {!feature.available && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '4px',
                                        pointerEvents: 'none'
                                    }}
                                >
                                </Box>
                            )}
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
