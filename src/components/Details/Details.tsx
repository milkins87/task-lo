import { useParams } from 'react-router-dom'
import { useState, useEffect, FunctionComponent } from 'react'
import ErrorBoundary from '../ErrorComponents/ErrorBoundary'
import ErrorPage from '../ErrorComponents/ErrorPage'

import './details.scss'

interface DetailsAPIResponse {
  opening_hours: {
    [key: string]: string[]
  },
  displayed_what: string,
  displayed_where: string,
}

const Details: FunctionComponent = () => {
  const { id, } = useParams() as { id: string }
  const [details, setDetails,] = useState<DetailsAPIResponse | null>({
    opening_hours: {},
    displayed_what: '',
    displayed_where: '',
  })
  const [openingHours, setOpeningHours,] = useState([{
    label: '',
    hours: [ {start: '', end: '',}, ],
  },])

  useEffect(() => {
    void requestDetails()
  }, [])

  const requestDetails = async () => {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://storage.googleapis.com/coding-session-rest-api/${id}`)}`)

    if(response.status == 200) {
      const data = await response.json()
      const parsedJson = JSON.parse(data.contents) as DetailsAPIResponse

      if(data.status.http_code == 404) {
        setDetails(null)
      } else {
        setDetails(parsedJson)
      }
    }
  }

  useEffect(() => {
    const days = details?.opening_hours?.days
    const TIME_SEPARATOR = '-'
    const SEGMENT_SEPARATOR = '|'

    const groups = days && Object.entries(days).reduce((obj, [key, hours,]) => {
      const groupedKey = hours.map((value: { start: string; end: string }) => value.start + TIME_SEPARATOR + value.end ).join(SEGMENT_SEPARATOR)

      if (!obj[groupedKey]) {
        obj[groupedKey] = { values: [],}
      }

      obj[groupedKey].values.push({day: key, hours,})

      return obj
    }, {})

    const result = groups && Object.values(groups).map(({ values, }) => {
      const first = values[0]
      const last = values[values.length - 1]
      const label = first === last ? first.day : first.day + ' - ' + last.day

      return {
        label,
        hours: first.hours,
      }
    })

    setOpeningHours(result)

  }, [details,])

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
            {openingHours && openingHours.map((item, idx) => (
              <div key={idx} className="opening-hours__section__item">
                <div className="opening-hours__day">{item.label}</div>
                <div>{item.hours?.map((time, idx) => <div key={idx}>
                  {time.start + ' - ' + time.end}
                </div>
                )}
                </div>
              </div>
            )
            )}
          </div>
        </div>
      </div>
    }
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
