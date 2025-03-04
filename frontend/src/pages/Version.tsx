import { useQuery } from "@tanstack/react-query"

export function Version(){
    const { isPending, error, data } = useQuery({
        queryKey: ['backend'],
        queryFn: () =>
          fetch('/api/version').then((res) =>
            res.json(),
          ),
      })
    
      if (isPending) return 'Loading...'
    
      if (error) return 'An error has occurred: ' + error.message
    
      return (
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Version</h1>
          <p>{data.value}</p>
          <p>{data.createdAt}</p>
        </div>
      )
    }