import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from '../ui/label';
import { PropertyOpinions, UserProfile } from '@/utils/interfaces';
import { format } from 'date-fns';

interface PropertyReviewsProps {
  reviews: PropertyOpinions[]; // Tipo correcto para las revisiones
  comment: boolean | null;
  user: UserProfile;
  propertyid: number;
}

const PropertyReviews: React.FC<PropertyReviewsProps> = ({ reviews: initialReviews, comment: comment, user: user, propertyid: propertyid }) => {
  const [reviews, setReviews] = useState<PropertyOpinions[]>(Array.isArray(initialReviews) ? initialReviews : []);

  const [newReview, setNewReview] = useState({
    propertyid: propertyid,
    studentid: user?.usuarioid,
    decrating: 0,
    vchcomment: '',
    vchname: user?.vchname,
    vchpaternalsurname: user?.vchmaternalsurname,
    vchmaternalsurname: user?.vchpaternalsurname,
    vchimage: user?.vchimage,
    roleid: user?.roleid,
    created_at: new Date().toLocaleDateString(),
    updated_at: new Date().toLocaleDateString()
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleRatingChange = (decrating: number) => {
    setNewReview({ ...newReview, decrating });
  };

  const handleSubmit = () => {
    // Crear una nueva reseña con un ID único
    const newReviewWithId = { ...newReview, reviewid: reviews.length + 1 };
    setReviews([...reviews, newReviewWithId]);

    // Restablecer el estado de la reseña nueva
    setNewReview({
      propertyid: propertyid,
      studentid: user?.usuarioid,
      decrating: 0,
      vchcomment: '',
      vchname: user?.vchname,
      vchpaternalsurname: user?.vchmaternalsurname,
      vchmaternalsurname: user?.vchpaternalsurname,
      vchimage: user?.vchimage,
      roleid: user?.roleid,
      created_at: new Date().toLocaleDateString(),
      updated_at: new Date().toLocaleDateString()
    });
  };

  return (
    <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className='text-blue-800 dark:text-blue-300'>Comentarios</CardTitle>
        {/* <Separator className='dark:bg-slate-400' /> */}
      </CardHeader>
      <CardContent>
        {/* Verificar si reviews es un array antes de usar map */}
        {reviews.length > 0 ? (
          reviews.map((review: PropertyOpinions) => (
            <div key={review.reviewid} className="my-6 last:mb-0">
              <div className="flex items-center mb-2">
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage src={review.vchimage} alt={review.vchname} />
                  <AvatarFallback>{review.vchname.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">
                    {review.vchname + ' ' + review.vchpaternalsurname + ' ' + review.vchmaternalsurname}
                  </h4>
                  <p className="text-sm text-muted-foreground">{format(new Date(review.created_at), 'yyyy-MM-dd HH:mm:ss')}</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < review.decrating ? "text-yellow-500 dark:text-yellow-400 fill-current" : "text-gray-400 dark:text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm">{review.vchcomment}</p>
            </div>
          ))
        ) : (
          <p>No hay comentarios disponibles.</p> // Mensaje si no hay comentarios
        )}
        <Card className='mt-6 dark:bg-gray-700 dark:border-gray-600'>
          <CardHeader>
            <CardTitle>Agregar comentario</CardTitle>
          </CardHeader>
          <CardContent>
            {comment ?
              <>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      onClick={() => handleRatingChange(i + 1)}
                      className={`h-5 w-5 cursor-pointer ${i < newReview.decrating ? "text-yellow-500 dark:text-yellow-400 fill-current" : "text-gray-400 dark:text-gray-300"}`}
                    />
                  ))}
                </div>
                <Label htmlFor='comment'>Comentario</Label>
                <Textarea
                  name="comment"
                  id='comment'
                  value={newReview.vchcomment}
                  onChange={handleInputChange}
                  placeholder="Tu comentario"
                  className="mb-2 text-sm border-gray-200 dark:text-gray-300"
                />
                <Button onClick={handleSubmit} className='w-full'>Enviar</Button>
              </>
              :
              <p className="text-sm">Sólo los huéspedes que se han hospedado pueden dejar un comentario.</p>
            }
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PropertyReviews;
