import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from '../ui/label';

interface Review {
  id: number;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
}

interface PropertyReviewsProps {
  reviews: Review[];
}

const PropertyReviews: React.FC<PropertyReviewsProps> = ({ reviews: initialReviews }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [newReview, setNewReview] = useState({
    author: '',
    avatar: '',
    date: new Date().toLocaleDateString(),
    rating: 0,
    comment: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleRatingChange = (rating: number) => {
    setNewReview({ ...newReview, rating });
  };

  const handleSubmit = () => {
    const newReviewWithId = { ...newReview, id: reviews.length + 1 };
    setReviews([...reviews, newReviewWithId]);
    setNewReview({
      author: '',
      avatar: '',
      date: new Date().toLocaleDateString(),
      rating: 0,
      comment: '',
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-900 border-none shadow-none">
      <CardHeader>
        <CardTitle>Comentarios</CardTitle>
        <Separator className='dark:bg-slate-400' />
      </CardHeader>
      <CardContent>
        {reviews.map((review) => (
          <div key={review.id} className="mb-6 last:mb-0">
            <div className="flex items-center mb-2">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage src={review.avatar} alt={review.author} />
                <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{review.author}</h4>
                <p className="text-sm text-muted-foreground">{review.date}</p>
              </div>
              <div className="ml-auto flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${i < review.rating ? "text-blue-500 dark:text-blue-400 fill-current" : "text-gray-400 dark:text-gray-300"
                      }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm">{review.comment}</p>
          </div>
        ))}
        <Card className='mt-6 dark:bg-gray-800'>
          <CardHeader>
            <CardTitle>Agregar comentario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  onClick={() => handleRatingChange(i + 1)}
                  className={`h-5 w-5 cursor-pointer ${i < newReview.rating ? "text-blue-500 dark:text-blue-400 fill-current" : "text-gray-400 dark:text-gray-300"
                    }`}
                />
              ))}
            </div>
            <Label htmlFor='comment'>Comentario</Label>
            <Textarea
              name="comment"
              id='comment'
              value={newReview.comment}
              onChange={handleInputChange}
              placeholder="Tu comentario"
              className="mb-2 text-sm"
            />
            <Button onClick={handleSubmit} className='w-full'>Enviar</Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PropertyReviews;