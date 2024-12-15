'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from 'lucide-react'

const formSchema = z.object({
  PropertyTypeID: z.number().int().positive(),
  LessorID: z.number().int().positive(),
  intNumberRooms: z.number().int().positive(),
  intNumberBathrooms: z.number().int().positive(),
  intMaxOccupancy: z.number().int().positive(),
  bnFurnished: z.boolean(),
  vchFurnitureType: z.string().optional(),
  decRentalCost: z.number().positive(),
  dtAvailabilityDate: z.date(),
  intMinContractDuration: z.number().int().positive(),
  intMaxContractDuration: z.number().int().positive(),
  decPropertyRating: z.number().min(0).max(5),
  bnStudyZone: z.boolean(),
  vchBuildingSecurity: z.string().optional(),
  vchTransportationAccess: z.string().optional(),
  vchPropertyRules: z.string(), // We'll parse this as JSON later
  vchTitle: z.string().max(50),
  vchDescription: z.string(),
  
  // Address fields
  vchExteriorNumber: z.string().max(10),
  vchInteriorNumber: z.string().max(10).optional(),
  vchStreet: z.string().max(100),
  vchAddressComplement: z.string().max(50).optional(),
  vchNeighborhood: z.string().max(100),
  vchMunicipality: z.string().max(100),
  vchStateProvince: z.string().max(100),
  intZip: z.number().int().positive(),
  vchCountry: z.string().max(35),
  
  // Included Services
  bnWaterIncluded: z.boolean(),
  bnElectricityIncluded: z.boolean(),
  bnInternetIncluded: z.boolean(),
  bnGasIncluded: z.boolean(),
  bnHeatingIncluded: z.boolean(),
  bnAirConditioningIncluded: z.boolean(),
  bnLaundryIncluded: z.boolean(),
  bnParkingIncluded: z.boolean(),
  bnCleaningIncluded: z.boolean(),
  bnCableTVIncluded: z.boolean(),
  
  // Additional Features
  decArea: z.number().positive(),
  flDistanceUniversity: z.number().nonnegative().optional(),
  vchAdditionalFeatures: z.string().optional(),
})

export function PropertyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bnFurnished: false,
      bnStudyZone: false,
      bnWaterIncluded: false,
      bnElectricityIncluded: false,
      bnInternetIncluded: false,
      bnGasIncluded: false,
      bnHeatingIncluded: false,
      bnAirConditioningIncluded: false,
      bnLaundryIncluded: false,
      bnParkingIncluded: false,
      bnCleaningIncluded: false,
      bnCableTVIncluded: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send the form data to your backend
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Property Details</h2>
          
          <FormField
            control={form.control}
            name="PropertyTypeID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type ID</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="LessorID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lessor ID</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="intNumberRooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Rooms</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="intNumberBathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Bathrooms</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="intMaxOccupancy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Occupancy</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bnFurnished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Furnished</FormLabel>
                  <FormDescription>
                    Is the property furnished?
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vchFurnitureType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Furniture Type</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="decRentalCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rental Cost</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dtAvailabilityDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Availability Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="intMinContractDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Contract Duration (months)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="intMaxContractDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Contract Duration (months)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="decPropertyRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Rating (0-5)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" max="5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bnStudyZone"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Study Zone</FormLabel>
                  <FormDescription>
                    Does the property have a study zone?
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vchBuildingSecurity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Building Security</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vchTransportationAccess"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transportation Access</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vchPropertyRules"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Rules (JSON format)</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Enter property rules in JSON format, e.g., {"{"}"no smoking": true, "quiet hours": "10pm-7am"{"}"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vchTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={50} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vchDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Address</h2>
          
          <FormField
            control={form.control}
            name="vchExteriorNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exterior Number</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={10} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vchInteriorNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interior Number</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={10} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vchStreet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={100} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vchAddressComplement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Complement</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={50} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vchNeighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Neighborhood</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={100} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vchMunicipality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Municipality</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={100} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vchStateProvince"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={100} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="intZip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vchCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={35} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Included Services</h2>
          
          {[
            "bnWaterIncluded",
            "bnElectricityIncluded",
            "bnInternetIncluded",
            "bnGasIncluded",
            "bnHeatingIncluded",
            "bnAirConditioningIncluded",
            "bnLaundryIncluded",
            "bnParkingIncluded",
            "bnCleaningIncluded",
            "bnCableTVIncluded"
          ].map((service) => (
            <FormField
              key={service}
              control={form.control}
              name={service as any}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {service.replace('bn', '').replace('Included', '')}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Additional Features</h2>
          
          <FormField
            control={form.control}
            name="decArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area (sq m)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="flDistanceUniversity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance to University (km)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vchAdditionalFeatures"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Features</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

