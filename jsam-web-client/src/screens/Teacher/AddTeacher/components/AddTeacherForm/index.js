import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withStyles } from "@material-ui/core";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

import FormValidator from "Utils/FormValidator";
import { openSnackbar } from "GlobalComponents/Notification";

const styles = theme => ({
  root: {},
  textField: {},
  formControl: {},
  group: {
    display: "flex",
    flexDirection: "row"
  },
  button: {
    marginTop: theme.spacing.unit * 0.7,
    marginRight: theme.spacing.unit * 0.7
  },
  progress: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    zIndex: 3
  },
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    background: theme.palette.grey[500],
    opacity: 0.4,
    zIndex: 2
  },
  datePicker: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

const defaultInput = () => ({
  name: "",
  email: "",
  facebook: "",
  phone: "",
  dateOfBirth: "",
  speciality: "",
  gender: ""
});

let statusList = [];

class AddTeacherForm extends React.Component {
  
  validator = new FormValidator([
    {
      field: "name",
      method: "isEmpty",
      validWhen: false,
      message: "Teacher name is required."
    }
  ]);

  state = {
    input: defaultInput(),
    statusDropdownOpenState: false,
    clientSideValidation: this.validator.valid(),
    hasEverSubmitted: false,
    isLoading: false,
    serverErrors: {}
  };

  componentWillMount = async() => {
    try{
      const subject =await axios.get("/api/subjects");    
      statusList = [...subject.data.details.Subjects];
    }catch(err){
      statusList = [];
    }
  }

  handleStatusDropdownClose = () => {
    this.setState({ statusDropdownOpenState: false });
  };

  handleStatusDropdownOpen = () => {
    this.setState({ statusDropdownOpenState: true });
  };

  handleInputChange = prop => e => {
    const { input } = this.state;
    const inputTemp = input;
    inputTemp[prop] = e.target.value;
    this.setState(() => ({ input: inputTemp }));
  };

  // FIXME: Needs refactoring
  handleSelfPhoneNumberInputChange = e => {
    const { value } = e.target;
    if (!value.match(/^[0-9]{0,10}$/)) return;

    const { input } = this.state;
    const inputTemp = input;
    inputTemp.phone = value;
    this.setState(() => ({ input: inputTemp }));
  };

  triggerLoadingState = () => {
    this.setState(() => ({ isLoading: true }));
  };

  turnOffLoadingState = () => {
    this.setState(() => ({ isLoading: false }));
  };

  performClientSideValidation = () => {
    const { input } = this.state;
    return this.validator.validate(input);
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.triggerLoadingState();

    this.setState(() => ({
      hasEverSubmitted: true
    }));

    const clientSideValidation = this.performClientSideValidation();
    this.setState(() => ({ clientSideValidation }));

    if (clientSideValidation.isValid) {
      const { input } = this.state;

      try {
        await axios.post("/api/teachers", input);
        this.handleReset();
        openSnackbar("Successfully added Teacher.");
      } catch (err) {
        const { response } = err;
        if (response.status === 504) {
          openSnackbar(
            "The server isn't responding at the moment. Please try again later."
          );
        } else {
          this.setState(() => ({ serverErrors: response.data.errors }));
          console.log(response);
        }
      }
    }

    this.turnOffLoadingState();
  };

  handleReset = () => {
    this.setState({
      input: defaultInput(),
      clientSideValidation: this.validator.valid(),
      hasEverSubmitted: false,
      serverErrors: {}
    });
  };

  render() {
    const { classes } = this.props;
    const {
      input,
      statusDropdownOpenState,
      hasEverSubmitted,
      clientSideValidation,
      isLoading,
      serverErrors
    } = this.state;

    let validation = hasEverSubmitted
      ? this.validator.validate(input)
      : clientSideValidation;

    const Loading = () => (
      <React.Fragment>
        <div className={classes.overlay} />
        <LinearProgress className={classes.progress} color="secondary" />
      </React.Fragment>
    );

    return (
      <React.Fragment>
        {isLoading && <Loading />}
        <form className={classes.root} onSubmit={this.handleSubmit}>
          <Grid spacing={24} container>
            <Grid item xs={12} lg={6}>
              <TextField
                id="teacher-name"
                label="Teacher Name"
                className={classes.textField}
                value={input.name}
                onChange={this.handleInputChange("name")}
                error={!!serverErrors.name || validation.name.isInvalid}
                helperText={serverErrors.name || "" || validation.name.message}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                id="email"
                label="Email"
                className={classes.textField}
                value={input.school}
                error={!!serverErrors.school}
                helperText={serverErrors.school || ""}
                onChange={this.handleInputChange("email")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                id="phone"
                label="Phone Number"
                className={classes.textField}
                value={input.phone.self}
                onChange={this.handleSelfPhoneNumberInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                id="facebook"
                label="Facebook"
                className={classes.textField}
                value={input.phone.parent}
                onChange={this.handleInputChange("facebook")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <form className={classes.container} noValidate>
                <TextField
                  id="date"
                  label="Birthday"
                  type="date"
                  defaultValue="2000-01-01"
                  className={classes.textField}
                  onChange={this.handleInputChange("dateOfBirth")}
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                />
              </form>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl className={classes.formControl} fullWidth noValidate>
                <InputLabel htmlFor="speciality">Speciality</InputLabel>
                <Select
                  open={statusDropdownOpenState}
                  onClose={this.handleStatusDropdownClose}
                  onOpen={this.handleStatusDropdownOpen}
                  value={input.speciality}
                  onChange={this.handleInputChange("speciality")}
                  inputProps={{
                    name: "speciality",
                    id: "speciality"
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {statusList.map(status => (
                    <MenuItem value={status._id}>{status.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={6}>
              <FormControl component="fieldset" className={classes.formControl}>
                <Grid
                  container
                  justify="space-between"
                  alignItems="center"
                  spacing={24}
                >
                  <Grid item>
                    <FormLabel component="legend" labelPlacement="left">
                      Gender
                    </FormLabel>
                  </Grid>
                  <Grid item>
                    <RadioGroup
                      id="gender"
                      aria-label="Gender"
                      className={classes.group}
                      value={input.gender}
                      onChange={this.handleInputChange("gender")}
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio color="primary" />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio color="primary" />}
                        label="Female"
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
                <FormHelperText error={!!serverErrors.gender}>
                  {serverErrors.gender}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                className={classes.button}
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                Create Teacher
              </Button>
              <Button
                type="reset"
                className={classes.button}
                variant="text"
                color="primary"
                onClick={this.handleReset}
                disabled={isLoading}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </form>
      </React.Fragment>
    );
  }
}

AddTeacherForm.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AddTeacherForm);
