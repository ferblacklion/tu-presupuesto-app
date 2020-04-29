import React from 'react';
declare interface IProfilePicture {
  photoURL: string;
  displayName: string;
}
export default function ProfilePicture({
  photoURL,
  displayName
}: IProfilePicture) {
  return (
    <div className="profile-picture">
      <img src={`${photoURL}`} alt={`${displayName}`} />
    </div>
  );
}
