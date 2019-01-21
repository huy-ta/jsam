import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Section from 'Shells/Section';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fuse from 'fuse.js';

import { fetchRoomsToReduxStore } from 'Services/rooms/actions';
import RoomTable from "./RoomTable"

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    position: 'relative',
    overflow: 'hidden'
  },
  loadingPaper: {
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit * 2
  }
});

class FindRoom extends React.Component {

  state = {
    searchInput: '',
    isLoading: false
  }

  isMounted = false;

  componentDidMount = async () => {
    this.isMounted = true;

    this.triggerLoadingState();

    try {
      const { dispatchFetchRoomsToReduxStore } = this.props;
      await dispatchFetchRoomsToReduxStore();
    }
    catch (err) {
      console.log(err);
    }

    this.turnOffLoadingState();
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  handleSearchInputChange = e => {
    const { value: searchInput } = e.target;
    this.setState(() => ({ searchInput }));
  };

  fuse = rooms => {
    const options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name', 'floor', 'capacity']
    };
    const { searchInput } = this.state;
    const fuse = new Fuse(rooms, options); 
    return fuse.search(searchInput);
  };

  triggerLoadingState = () => {
    this.setState({ isLoading: true });
  };

  turnOffLoadingState = () => {
    this.setState({ isLoading: false });
  };

  render() {

    const { classes, rooms } = this.props;
    const { searchInput, isLoading } = this.state;

    let filteredRoomList = rooms;
    if (searchInput.length > 1) {
      filteredRoomList = this.fuse(rooms);
    }

    const Loading = () => (
      <Paper className={classes.loadingPaper}>
        <Grid container spacing={24} direction="column" justify="center" alignItems="center">
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.typography}>Loading data from server, please wait...</Typography>
          </Grid>
        </Grid>
      </Paper>
    );

    return (
      <Section header="Rooms" subheader="Find Room">
        <Paper className={classes.root} elevation={6}>
          <Typography className={classes.typography}>Find Room</Typography>
          <TextField
            id="search-input"
            label="Room name"
            value={searchInput}
            fullWidth
            onChange={this.handleSearchInputChange}
          />
        </Paper>

        {isLoading ? <Loading /> : <RoomTable rooms={filteredRoomList} />}
      </Section>
    )
  }
}
FindRoom.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  rooms: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dispatchFetchRoomsToReduxStore: PropTypes.func.isRequired
};

const mapStateToProps = ({ rooms }) => ({ rooms });

const mapDispatchToProps = dispatch => ({
  dispatchFetchRoomsToReduxStore: () => dispatch(fetchRoomsToReduxStore())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FindRoom));