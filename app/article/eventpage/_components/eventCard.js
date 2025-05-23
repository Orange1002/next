import React from 'react'
import Image from 'next/image'
const EventCard = ({ imageSrc, title, link = '#' }) => {
  return (
    <a href={link} className="event-card card">
      <Image width={100} height={100} src={imageSrc} alt={title} />
      <div className="event-card-content">{title}</div>
    </a>
  )
}

export default EventCard
