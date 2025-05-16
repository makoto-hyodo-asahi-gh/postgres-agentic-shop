import React from 'react';
import { useFetch } from 'services/api-callers';
import { USERS_API } from 'constants/api-urls';
import { UsersList } from 'src/types/users.type';
import ErrorState from 'components/error-state/error-state';
import { BASE_URL } from 'constants/constants';
import { useNavigate } from 'react-router-dom';
import OverlayWithSpinner from 'components/overlay-with-spinner/overlay-with-spinner';
import { AvatarContainer, MainContainer, ProfileGrid, ProfileLink, ProfileName, Title } from './user-profiles.style';

const Profiles = () => {
  const { data: profiles, error, isLoading } = useFetch<UsersList>('users', USERS_API);
  const navigate = useNavigate();

  const handleProfileSelect = (profileId: number) => {
    sessionStorage.setItem('userId', profileId.toString()); // Store userId in sessionStorage
    navigate('/products');
  };

  if (isLoading) return <OverlayWithSpinner />;
  if (error || !profiles) return <ErrorState />;

  return (
    <MainContainer>
      <Title>AgenticShop</Title>

      <ProfileGrid>
        {profiles.map((profile) => (
          <ProfileLink key={`${profile.first_name}${profile.id}`} onClick={() => handleProfileSelect(profile.id)}>
            <AvatarContainer>
              <img
                src={`${BASE_URL}${profile.avatar_url}`}
                alt={profile.first_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </AvatarContainer>
            <ProfileName>{`${profile?.first_name} ${profile?.last_name}`}</ProfileName>
          </ProfileLink>
        ))}
      </ProfileGrid>
    </MainContainer>
  );
};

export default Profiles;
