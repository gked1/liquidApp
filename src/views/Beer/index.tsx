import { useEffect, useState } from 'react';
import { Beer as IBeer } from '../../types';
import { fetchData } from './utils';
import { useParams, useNavigate  } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Tooltip } from '@mui/material';

const Beer = () => {
  const { id } = useParams();
  const [beer, setBeer] = useState<IBeer>();
  const navigate = useNavigate();

  // eslint-disable-next-line
  useEffect(fetchData.bind(this, setBeer, id), [id]);

  const goBack = () => {
    navigate('/');
  }

  return (
    <article>
      <section>
        <div style={{ paddingTop: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'min-content auto', alignItems: 'center'}}>
            <Tooltip          
              title='Back to the table'
              arrow placement="top"
            >
              <ArrowBackIcon
                onClick={goBack}
                fontSize="large"
                color="primary"
                sx={{
                  display: 'inline-block',
                  cursor: 'pointer',
                  verticalAlign: 'bottom',
                  '&:hover': {
                    backgroundColor: "#EFF3F6",
                  }
                }}
              />
            </Tooltip>
          </div>
        </div>
        <header>
          <h1>{beer?.name}</h1>
        </header>
        <main>
          <span>
            <b>Type: </b> {beer?.brewery_type}
          </span>
        </main>
      </section>
    </article>
  );
};

export default Beer;
