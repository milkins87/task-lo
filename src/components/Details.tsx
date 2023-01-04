import { useParams } from 'react-router-dom'
import { useState, useEffect, FunctionComponent } from 'react'
import ErrorBoundary from '../ErrorBoundary'
import ErrorPage from './ErrorPage'
import { DetailsAPIResponse } from '../APIResponsesTypes'

import './details.scss'

const Details: FunctionComponent = () => {
  const { id, } = useParams() as { id: string }
  const [details, setDetails,] = useState<DetailsAPIResponse | null>({
    opening_hours: {
      days: {},
    },
    displayed_what: '',
    displayed_where: '',
  })
  const [openingHours, setOpeningHours,] = useState([{
    label: '',
    hours: [{start: '', end: '',},],
  },])

  useEffect(() => {
     void requestDetails()
  }, [])

  async function requestDetails() {
    // const req = await fetch(`https://storage.googleapis.com/coding-session-rest-api/${id}`)
    // To skip the cors issues, I had to use https://api.allorigins.win/get, as other solutions didn't work
    const req = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://storage.googleapis.com/coding-session-rest-api/${id}`)}`)
    if(req.status == 200) {
      const json = (await req.json()) as DetailsAPIResponse
      const parsedJson = JSON.parse(json.contents)
      if(json.status.http_code == 404) {
        setDetails(null)
      } else {
        setDetails(parsedJson)
      }
    }
  }

  useEffect(() => {
    const days =  details?.opening_hours?.days
    const TIME_SEPARATOR = '-'
    const SEGMENT_SEPARATOR = '|'

    const groups = days && Object.entries(days).reduce((obj, [key, hours,]) => {
      const compositeKey = hours.map((value: { start: string; end: string }) => value.start + TIME_SEPARATOR + value.end ).join(SEGMENT_SEPARATOR)

      if (!obj[compositeKey]) {
       
        obj[compositeKey] = { values: [],}
      }

      obj[compositeKey].values.push({date: key, hours ,})

      return obj
    }, {})

    // console.log('groups', JSON.stringify(groups, null, 2));

    const result = groups && Object.values(groups).map(({values,}) => {
      const first = values[0]
      const last = values[values.length - 1]
      const label = first === last ? first.date : first.date + ' - ' + last.date

      return {
        label,
        hours: first.hours,
      }
    })

    setOpeningHours(result)
  }, [details,])

  // console.log(details)

  return (<>
        {!details ? <ErrorPage /> :
    <div className="details">
      <div>
        <h1>{details?.displayed_what}</h1>
        <h2>{details?.displayed_where}</h2>
      </div>

      <div className="opening-hours">
        <div className="opening-hours__title"><span>Opening</span> hours</div>
        <div className="opening-hours__section">
          {openingHours && openingHours.map((item, idx) => <div key={idx} className="opening-hours__section__item">
            <div className="opening-hours__day">{item.label}</div>
            <div>{item.hours?.map((time,idx) => <div key={idx}>
              {time.start + '-' + time.end}
            </div>
            )}
            </div>
          </div>
          )}
        </div>
      </div>
      <div>
      </div>
    </div>}
    </>
  )
}

export default function DetailsErrorBoundary() {
  return (
    <ErrorBoundary>
      <Details />
    </ErrorBoundary>
  )
}
