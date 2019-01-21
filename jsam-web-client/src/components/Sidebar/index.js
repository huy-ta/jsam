import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Hidden from '@material-ui/core/Hidden';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import defaultUserAvatar from 'Assets/images/user-avatar-grey.jpg';

import { sidebarSections } from './sidebarSections';

const styles = theme => ({
  drawer: {
    width: theme.spacing.drawerWidth.mdUp,
    [theme.breakpoints.up('xl')]: {
      width: theme.spacing.drawerWidth.xlUp
    },
    flexShrink: 0
  },
  drawerPaper: {
    width: theme.spacing.drawerWidth.mdUp,
    [theme.breakpoints.up('xl')]: {
      width: theme.spacing.drawerWidth.xlUp
    },
    boxShadow: theme.shadows[5],
    background: theme.palette.grey[900],
    border: 'none',
    color: theme.palette.grey[200]
  },
  profileSection: {
    background: theme.palette.common.black,
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
    boxShadow: theme.shadows[1]
  },
  profileContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  avatar: {
    borderRadius: '50%'
  },
  profileText: {
    color: theme.palette.secondary.contrastText
  },
  list: {},
  listItem: {
    color: theme.palette.grey[300]
  },
  selected: {
    background: `${theme.palette.primary.dark} !important`,
    color: theme.palette.secondary.contrastText
  },
  listItemIcon: {
    color: 'inherit'
  },
  listItemText: {
    color: 'inherit'
  },
  nested: {
    paddingLeft: 24 + theme.spacing.unit * 0.5
  },
  verticalCompact: {
    paddingTop: 0,
    paddingBottom: 0
  },
  section: {
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit / 2
  },
  sectionName: {
    color: theme.palette.grey[400]
  }
});

let openSidebarFn;

const defaultIsItemExpanded = {};
sidebarSections.forEach(sidebarSection => {
  sidebarSection.items.forEach(item => {
    if (item.children) {
      defaultIsItemExpanded[item.codeName] = item.expanded;
    }
  });
});

class Sidebar extends React.Component {
  state = {
    isItemExpanded: defaultIsItemExpanded,
    isMobileSidebarOpen: false
  };

  componentDidMount() {
    openSidebarFn = this.toggleMobileDrawer(true);
  }

  handleExpandItem = item => () => {
    const { isItemExpanded } = this.state;
    let isItemExpandedTemp = isItemExpanded;
    isItemExpandedTemp[`${item}`] = !isItemExpandedTemp[`${item}`];
    this.setState(() => ({ isItemExpanded: isItemExpandedTemp }));
  };

  toggleMobileDrawer = open => () => {
    this.setState(() => ({ isMobileSidebarOpen: open }));
  };

  render() {
    const {
      classes,
      location: { pathname },
      auth
    } = this.props;
    const { isItemExpanded, isMobileSidebarOpen } = this.state;

    const ProfileSection = (
      <List className={classes.profileSection}>
        <ListItem className={classnames(classes.profileContainer, classes.verticalCompact)}>
          <ListItemIcon className={classes.listItemIcon}>
            <img src={defaultUserAvatar} className={classes.avatar} alt="mSIS Logo" width="48px" height="48px" />
          </ListItemIcon>
          <ListItemText>
            <Typography className={classes.profileText}>{auth.user.name || 'Anonymous'}</Typography>
          </ListItemText>
        </ListItem>
      </List>
    );

    const SidebarNavList = sidebarSections.map(sidebarSection => (
      <React.Fragment key={sidebarSection.sectionId}>
        <div className={classes.section}>
          <Typography variant="body2" className={classes.sectionName}>
            {sidebarSection.sectionDisplayName}
          </Typography>
        </div>
        <List className={classnames(classes.list, classes.verticalCompact)}>
          {sidebarSection.items.map(item => {
            if (item.allowedRoles) {
              if (!item.allowedRoles.includes(auth.user.role)) {
                return null;
              }
            }

            if (item.children) {
              const childrenItems = item.children.map(childItem => {
                if (childItem.allowedRoles) {
                  if (!childItem.allowedRoles.includes(auth.user.role)) {
                    return null;
                  }
                }
                return (
                  <Collapse in={isItemExpanded[item.codeName]} timeout="auto" unmountOnExit key={childItem.codeName}>
                    <List component="div" className={classes.verticalCompact}>
                      <ListItem
                        button
                        className={classnames(classes.nested, classes.listItem)}
                        classes={{
                          selected: classes.selected
                        }}
                        component={!(childItem.path === pathname) ? Link : null}
                        to={childItem.path}
                        selected={childItem.path === pathname}
                      >
                        <ListItemIcon className={classes.listItemIcon}>{childItem.icon()}</ListItemIcon>
                        <ListItemText inset disableTypography>
                          <Typography className={classes.listItemText} variant="body2">
                            {childItem.displayName}
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    </List>
                  </Collapse>
                );
              });

              return (
                <React.Fragment key={item.codeName}>
                  <ListItem button className={classes.listItem} onClick={this.handleExpandItem(item.codeName)}>
                    <ListItemIcon className={classes.listItemIcon}>{item.icon()}</ListItemIcon>
                    <ListItemText inset disableTypography>
                      <Typography className={classes.listItemText} variant="body2">
                        {item.displayName}
                      </Typography>
                    </ListItemText>
                    {isItemExpanded[item.codeName] ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  {childrenItems}
                  <Divider />
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={item.codeName}>
                <ListItem
                  button
                  className={classes.listItem}
                  classes={{
                    selected: classes.selected
                  }}
                  component={!(item.path === pathname) ? Link : null}
                  to={item.path}
                  selected={item.path === pathname}
                >
                  <ListItemIcon className={classes.listItemIcon}>{item.icon()}</ListItemIcon>
                  <ListItemText inset disableTypography>
                    <Typography className={classes.listItemText} variant="body2">
                      {item.displayName}
                    </Typography>
                  </ListItemText>
                </ListItem>
                <Divider />
              </React.Fragment>
            );
          })}
        </List>
      </React.Fragment>
    ));

    return (
      <React.Fragment>
        <Hidden mdDown>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper
            }}
            anchor="left"
          >
            {ProfileSection}
            {SidebarNavList}
          </Drawer>
        </Hidden>
        <Hidden mdUp>
          <Drawer
            className={classes.drawer}
            variant="temporary"
            classes={{
              paper: classes.drawerPaper
            }}
            anchor="left"
            open={isMobileSidebarOpen}
            onClose={this.toggleMobileDrawer(false)}
          >
            {ProfileSection}
            {SidebarNavList}
          </Drawer>
        </Hidden>
      </React.Fragment>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  auth: PropTypes.shape({}).isRequired
};

export const openSidebar = () => {
  openSidebarFn();
};

const mapStateToProps = ({ auth }) => ({
  auth
});

export default compose(
  withRouter,
  connect(mapStateToProps),
  withStyles(styles)
)(Sidebar);
