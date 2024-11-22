import PropTypes from 'prop-types'; 
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


export default function MediaCard({ name, time,image }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={image}
        title="green iguana"
      />
      <CardContent style={{width:"230px"}}>
        <h1 style={{width:"100%", textAlign:"center"}}>
          {name}
        </h1>
        <Typography variant='h1'  color='text.secondary' >
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}

MediaCard.propTypes = {
  name: PropTypes.string.isRequired, 
  time: PropTypes.string.isRequired, 
  image: PropTypes.string.isRequired
};
