import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Typography from '@mui/material/Typography';


const chartData = [
    {
        type: 'LineChart',
        description: 'Expedientes digitalizados',
        props: {
            xAxis: [{ data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }],
            series: [{ data: [0, 1230, 4000, 8000, 9300, 11500, 13500, 15000, 16700, 18500, 19000, 19500, 20000] }],
            height: 350
            
        }
    },
    {
        type: 'PieChart',
        description: 'Expedientes totales vs digitalizados',
        props: {
            series: [{
                data: [
                    { id: 0, value: 120000, label: 'Total' },
                    { id: 1, value: 20000, label: 'Digitalizados' },
                ],
            }],
            height: 250
        }
    },
    {
        type: 'BarChart',
        description: 'Expedientes segun tipo',
        props: {
            xAxis: [{ scaleType: 'band', data: ['habilitaciones', 'sumarios', 'comunicaciones', 'resolucion', 'ordenanza', 'expedientes'] }],
            series: [
                { data: [626, 26, 18, 15, 196, 17] },
            ],
            height: 350
        }
    },
    {
        type: 'BarChart',
        description: 'Expedientes digitalizados por año',
        props: {
            xAxis: [{ scaleType: 'band', data: ['2016', '2017', '2018', '2019', '2020', '2021'] }],
            series: [
                { data: [94, 432, 3373, 3445, 1984, 980] }
            ],
            height: 350
        }
    }
];

const ChartComponent = ({ type, props, description }) => {
    let Chart;
    switch (type) {
        case 'LineChart':
            Chart = LineChart;
            break;
        case 'PieChart':
            Chart = PieChart;
            break;
        case 'BarChart':
            Chart = BarChart;
            break;
        default:
            return null;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 400 }}>
            <Chart {...props} />
            <Typography variant="subtitle1" align="center">
                {description}
            </Typography>
        </Box>
    );
};

export default function Charts() {
    return (
        <Container maxWidth={false} sx={{ width: '95%' }}>
            <Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 4 }}>
                {chartData.map((chart, index) => (
                    <Grid xs={1} sm={1} md={1} key={index}>
                        <Box>
                            <ChartComponent type={chart.type} props={chart.props} description={chart.description} />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}