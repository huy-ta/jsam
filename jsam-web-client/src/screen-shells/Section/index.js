import React from 'react';
import PropTypes from 'prop-types';

import SectionHeader from 'GlobalComponents/SectionHeader';
import SectionContainer from 'GlobalComponents/SectionContainer';

const Section = props => {
  const { children, header, subheader } = props;

  return (
    <div>
      <SectionHeader header={header} subheader={subheader} />
      <SectionContainer>{children}</SectionContainer>
    </div>
  );
};

Section.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.string.isRequired,
  subheader: PropTypes.string.isRequired
};

export default Section;
