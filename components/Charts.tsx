import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { colors } from '@mui/material';


const chartData = [
    {
        type: 'LineChart',
        props: {
            xAxis: [{ data: [1, 2, 3, 5, 8, 10] }],
            series: [{ data: [2, 5.5, 2, 8.5, 1.5, 5] }],
            height: 350
            
        }
    },
    {
        type: 'PieChart',
        props: {
            series: [{
                data: [
                    { id: 0, value: 10, label: 'series A' },
                    { id: 1, value: 15, label: 'series B' },
                    { id: 2, value: 20, label: 'series C' }
                ],
            }],
            height: 250
        }
    },
    {
        type: 'BarChart',
        props: {
            xAxis: [{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }],
            series: [
                { data: [4, 3, 5] },
                { data: [1, 6, 3] },
                { data: [2, 5, 6] }
            ],
            height: 350
        }
    },
    {
        type: 'BarChart',
        props: {
            xAxis: [{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }],
            series: [
                { data: [4, 3, 5] },
                { data: [1, 6, 3] },
                { data: [2, 5, 6] }
            ],
            height: 350
        }
    }
];

const ChartComponent = ({ type, props }) => {
    switch (type) {
        case 'LineChart':
            return <LineChart {...props} />;
        case 'PieChart':
            return <PieChart {...props} />;
        case 'BarChart':
            return <BarChart {...props} />;
        default:
            return null;
    }
};

export default function Charts() {
    return (
        <Container maxWidth={false} sx={{ width: '95%' }}>
            <Grid container spacing={2} columns={{ xs: 1, sm: 1, md: 4 }}>
                {chartData.map((chart, index) => (
                    <Grid xs={1} sm={1} md={1} key={index}>
                        <Box>
                            <ChartComponent type={chart.type} props={chart.props} />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}